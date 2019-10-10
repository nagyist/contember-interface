import * as React from 'react'
import { AccessorTreeStateContext, useAccessorTreeState } from '../accessorTree'
import { EntityName } from '../bindingTypes'
import { MarkerTreeRoot } from '../dao'
import { Component } from './Component'

interface EntityCreatorProps {
	entityName: EntityName
	children: React.ReactNode
}

export const EntityCreator = Component<EntityCreatorProps>(
	props => {
		const accessorTreeState = useAccessorTreeState(props.children)

		return (
			<AccessorTreeStateContext.Provider value={accessorTreeState}>{props.children}</AccessorTreeStateContext.Provider>
		)
	},
	{
		generateMarkerTreeRoot: (props, fields) => new MarkerTreeRoot(props.entityName, fields, undefined),
	},
	'EntityCreator',
)
