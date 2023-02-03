import type { ComponentType, ReactElement, ReactNode } from 'react'
import { useEntityList } from '../accessorPropagation'
import { PRIMARY_KEY_NAME } from '@contember/binding'
import { Environment } from '@contember/binding'
import { MarkerFactory } from '@contember/binding'
import type { SugaredRelativeEntityList } from '@contember/binding'
import { Component } from './Component'
import { EntityList, EntityListBaseProps } from './EntityList'
import { Field } from './Field'
import { TreeNodeEnvironmentFactory } from '@contember/binding'

export type HasManyProps<ListProps = never, EntityProps = never> = SugaredRelativeEntityList & {
	children?: ReactNode
	variables?: Environment.ValuesMapWithFactory
} & (
		| {}
		| {
				listComponent: ComponentType<ListProps & EntityListBaseProps>
				listProps?: ListProps
		  }
	)

export const HasMany = Component(
	<ListProps, EntityProps>(props: HasManyProps<ListProps, EntityProps>) => {
		const entityList = useEntityList(props)

		return <EntityList {...props} accessor={entityList} />
	},
	{
		generateEnvironment: (props, oldEnvironment) => {
			const environment = oldEnvironment.withVariables(props.variables)
			return TreeNodeEnvironmentFactory.createEnvironmentForEntityList(environment, props)
		},
		staticRender: props => (
			<EntityList {...props} accessor={undefined as any}>
				<Field field={PRIMARY_KEY_NAME} />
				{props.children}
			</EntityList>
		),
		generateBranchMarker: (props, fields, environment) =>
			MarkerFactory.createRelativeEntityListFields(props, environment, fields),
	},
	'HasMany',
) as <ListProps, EntityProps>(props: HasManyProps<ListProps, EntityProps>) => ReactElement
