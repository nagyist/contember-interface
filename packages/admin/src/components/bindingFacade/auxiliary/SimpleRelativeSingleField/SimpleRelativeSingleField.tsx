import { Component, Environment, Field, FieldAccessor, FieldBasicProps, FieldValue } from '@contember/react-binding'
import type { FieldContainerProps } from '@contember/ui'
import type { NamedExoticComponent, ReactNode } from 'react'
import { SimpleRelativeSingleFieldProxy } from './SimpleRelativeFieldProxy'

export type SimpleRelativeSingleFieldProps = FieldBasicProps & Omit<FieldContainerProps, 'children'>

export interface SimpleRelativeSingleFieldMetadata<Value extends FieldValue = FieldValue> {
	field: FieldAccessor<Value>
	environment: Environment
	isMutating: boolean
}

export const SimpleRelativeSingleField = function <
	P extends FieldBasicProps & Omit<FieldContainerProps, 'children'>,
	Value extends FieldValue = FieldValue,
>(
	render: (fieldMetadata: SimpleRelativeSingleFieldMetadata<Value>, props: P) => ReactNode,
	displayName: string,
	defaultProps?: Partial<P>,
): NamedExoticComponent<P> {
	return Component<P>(
		props => <SimpleRelativeSingleFieldProxy {...defaultProps} {...props} render={render} />,
		(props: P) => {
			const normalizedProps = {
				...defaultProps,
				...props,
			}
			return (
				<>
					<Field
						defaultValue={normalizedProps.defaultValue}
						field={normalizedProps.field}
						isNonbearing={normalizedProps.isNonbearing}
					/>
					{normalizedProps.label}
					{normalizedProps.labelDescription}
					{normalizedProps.description}
				</>
			)
		},
		displayName,
	)
}
