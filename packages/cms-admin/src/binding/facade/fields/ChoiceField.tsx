import { GraphQlBuilder } from 'cms-client'
import * as React from 'react'
import { EntityName, FieldName, Filter, Scalar } from '../../bindingTypes'
import {
	EnforceSubtypeRelation,
	EntityListDataProvider,
	Field,
	Props,
	SyntheticChildrenProvider,
	ToOne
} from '../../coreComponents'
import { Environment, FieldAccessor, Literal, VariableLiteral, VariableScalar } from '../../dao'
import { VariableInputTransformer } from '../../model/VariableInputTransformer'
import { Parser } from '../../queryLanguage'

export interface ChoiceFieldPublicProps {
	name: FieldName
}

export interface ChoiceFieldBaseProps<Label extends React.ReactNode = React.ReactNode> {
	children: (
		data: ChoiceField.Data<Label>,
		currentValue: ChoiceField.ValueRepresentation | null,
		onChange: (newValue: ChoiceField.ValueRepresentation) => void,
		environment: Environment
	) => React.ReactNode
}

export interface ChoiceFieldStaticProps<Label extends React.ReactNode = React.ReactNode> {
	options: Array<[ChoiceField.LiteralValue, Label]> | Array<[ChoiceField.ScalarValue, Label]>
}

export interface ChoiceFieldDynamicProps {
	entityName: EntityName
	optionFieldName: FieldName
	filter?: Filter
}

export type ChoiceFieldProps<Label extends React.ReactNode = React.ReactNode> = ChoiceFieldPublicProps &
	ChoiceFieldBaseProps<Label> &
	(ChoiceFieldDynamicProps | ChoiceFieldStaticProps<Label>)

class ChoiceField<Label extends React.ReactNode = React.ReactNode> extends React.Component<ChoiceFieldProps<Label>> {
	public static displayName = 'ChoiceField'

	public render() {
		return (
			<Field.DataRetriever name={this.props.name}>
				{(fieldName, data, environment) => {
					if ('options' in this.props) {
						const rawOptions = this.props.options

						if (rawOptions.length === 0) {
							return null
						}

						const options: Array<[GraphQlBuilder.Literal | Scalar, Label]> = this.isLiteralStaticMode(rawOptions)
							? this.normalizeLiteralStaticOptions(rawOptions, environment)
							: this.normalizeScalarStaticOptions(rawOptions, environment)

						return (
							<Field name={fieldName}>
								{(data: FieldAccessor): React.ReactNode => {
									return this.props.children(
										options.map((item, i): [ChoiceField.ValueRepresentation, Label] => [i.toFixed(0), item[1]]),
										options.reduce((acc: ChoiceField.ValueRepresentation | null, [value], index) => {
											if (acc !== null) {
												return acc
											}
											if (
												data.hasValue(value) ||
												(value instanceof GraphQlBuilder.Literal &&
													typeof data.currentValue === 'string' &&
													value.value === data.currentValue)
											) {
												return index.toFixed(0)
											}
											return null
										}, null),
										(newValue: ChoiceField.ValueRepresentation) => {
											data.onChange && data.onChange(options[parseInt(newValue, 10)][0])
										},
										environment
									)
								}}
							</Field>
						)
					}
					return null // TODO handle the dynamic case
				}}
			</Field.DataRetriever>
		)
	}

	private normalizeLiteralStaticOptions(
		options: Array<[ChoiceField.LiteralValue, Label]>,
		environment: Environment
	): Array<[GraphQlBuilder.Literal, Label]> {
		return options.map(
			([key, value]): [GraphQlBuilder.Literal, Label] => [
				key instanceof VariableLiteral ? VariableInputTransformer.transformVariableLiteral(key, environment) : key,
				value
			]
		)
	}

	private normalizeScalarStaticOptions(
		options: Array<[ChoiceField.ScalarValue, Label]>,
		environment: Environment
	): Array<[Scalar, Label]> {
		return options.map(
			([key, value]): [Scalar, Label] => [
				key instanceof VariableScalar ? VariableInputTransformer.transformVariableScalar(key, environment) : key,
				value
			]
		)
	}

	private isLiteralStaticMode(
		options: ChoiceFieldStaticProps<Label>['options']
	): options is Array<[ChoiceField.LiteralValue, Label]> {
		if (options.length === 0) {
			return false
		}

		const optionIndicator = options[0][0]
		return optionIndicator instanceof VariableLiteral || optionIndicator instanceof Literal
	}

	public static generateSyntheticChildren(
		props: Props<ChoiceFieldPublicProps & (ChoiceFieldStaticProps | ChoiceFieldDynamicProps)>,
		environment: Environment
	): React.ReactNode {
		if ('options' in props) {
			return Parser.generateWrappedNode(props.name, fieldName => <Field name={fieldName} />, environment)
		}
		return (
			<>
				<EntityListDataProvider name={props.entityName} filter={props.filter} associatedField={props.name}>
					<Field name={props.optionFieldName} />
				</EntityListDataProvider>
				<ToOne field={props.name}>
					<Field name={props.optionFieldName} />
				</ToOne>
			</>
		)
	}
}

namespace ChoiceField {
	export type ScalarValue = Scalar | VariableScalar

	export type LiteralValue = VariableLiteral | Literal

	export type ValueRepresentation = string

	export type Data<Label extends React.ReactNode = React.ReactNode> = Array<[ValueRepresentation, Label]>
}

export { ChoiceField }

type EnforceDataBindingCompatibility = EnforceSubtypeRelation<
	typeof ChoiceField,
	SyntheticChildrenProvider<ChoiceFieldProps>
>