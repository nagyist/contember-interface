import { ComponentType, FunctionComponent, ReactNode } from 'react'
import { Component, QueryLanguage, SugarableRelativeSingleField, wrapFilterInHasOnes } from '@contember/react-binding'
import { GraphQlLiteral, Input } from '@contember/client'
import { DataGridColumnCommonProps, FilterRendererProps } from '../types'
import { DataGridColumn } from '../grid'

export type EnumCellRendererProps = {
	field: SugarableRelativeSingleField | string
}

export type EnumCellProps =
	& DataGridColumnCommonProps
	& EnumCellRendererProps

	& {
		options: Record<string, string>
		format?: (value: string | null) => ReactNode
	}

export type EnumCellFilterArtifacts = {
	values: string[]
	nullCondition: boolean
}

/** @deprecated */
export type LegacyEnumCellArtifacts = string[]

export const createEnumCell = <ColumnProps extends {}, ValueRendererProps extends {}, FilterProps extends {}>({ FilterRenderer, ValueRenderer }: {
	FilterRenderer: ComponentType<FilterRendererProps<EnumCellFilterArtifacts | LegacyEnumCellArtifacts, FilterProps>>,
	ValueRenderer: ComponentType<EnumCellRendererProps & ValueRendererProps>
}): FunctionComponent<EnumCellProps & ColumnProps & ValueRendererProps & FilterProps> => Component(props => {
	return (
		<DataGridColumn<EnumCellFilterArtifacts | LegacyEnumCellArtifacts>
			{...props}
			enableOrdering={true}
			getNewOrderBy={(newDirection, { environment }) =>
				newDirection ? QueryLanguage.desugarOrderBy(`${props.field as string} ${newDirection}`, environment) : undefined
			}
			enableFiltering={true}
			getNewFilter={(filter, { environment }) => {
				const { values, nullCondition = false } = Array.isArray(filter) ? {
					values: filter,
				} : filter

				if (values.length === 0 && !nullCondition) {
					return undefined
				}
				const desugared = QueryLanguage.desugarRelativeSingleField(props.field, environment)

				const conditions: Input.Condition<GraphQlLiteral>[] = []

				if (nullCondition) {
					conditions.push({ isNull: true })
				}

				conditions.push({
					in: values.map(it => new GraphQlLiteral(it)),
				})

				return wrapFilterInHasOnes(desugared.hasOneRelationPath, {
					[desugared.field]: { or: conditions },
				})
			}}
			emptyFilter={{ nullCondition: false, values: [] }}
			filterRenderer={filterProps => <FilterRenderer {...filterProps} {...props} />}
		>
			<ValueRenderer {...props} />
		</DataGridColumn>
	)
}, 'EnumCell')
