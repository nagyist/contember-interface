import { ComponentType, createElement, memo, ReactElement, ReactNode } from 'react'
import { AccessorTree, AccessorTreeState, AccessorTreeStateOptions, useDataBinding } from '../accessorTree'

export type DataBindingProviderBaseProps  =
	& AccessorTreeStateOptions

export interface DataBindingStateComponentProps {
	accessorTreeState: AccessorTreeState
	children?: ReactNode
}

export type DataBindingProviderProps<StateProps> = DataBindingProviderBaseProps &
	(
		| {}
		| {
				stateComponent: ComponentType<StateProps & DataBindingStateComponentProps>
				stateProps?: StateProps
		  }
	)

export const DataBindingProvider = memo(function DataBindingProvider<StateProps extends DataBindingStateComponentProps>(
	props: DataBindingProviderProps<StateProps>,
) {
	const accessorTreeState = useDataBinding(props)

	const children =
		'stateComponent' in props && props.stateComponent
			? createElement(
					props.stateComponent,
					{
						...props.stateProps!,
						accessorTreeState: accessorTreeState,
					},
					props.children,
			  )
			: props.children
	return <AccessorTree state={accessorTreeState}>{children}</AccessorTree>
}) as <StateProps>(props: DataBindingProviderProps<StateProps>) => ReactElement
