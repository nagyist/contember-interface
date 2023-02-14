import { Component, EntityListSubTree } from '@contember/react-binding'
import { ComponentType, Fragment } from 'react'
import {
	DataGridColumnProps,
	DataGridFilterArtifact,
	DataGridRendererInnerProps,
	DataGridRendererProps,
} from '../types'

export const createDataGridRenderer = <ColumnProps extends {}, ContainerProps extends {}>({ Fallback, Container, StaticRender, ColumnStaticRender }: {
	Fallback: ComponentType<{}>
	Container: ComponentType<DataGridRendererInnerProps<ColumnProps> & ContainerProps>
	StaticRender?: ComponentType<DataGridRendererInnerProps<ColumnProps> & ContainerProps>
	ColumnStaticRender?: ComponentType<{ column: DataGridColumnProps<DataGridFilterArtifact, ColumnProps> }>
}) => Component<DataGridRendererProps<ColumnProps> & ContainerProps>(({ treeRootId, ...props }) => {
	if (!props.displayedState) {
		return <Fallback />
	}
	const {
		entities,
		paging: { pageIndex, itemsPerPage },
		hiddenColumns,
		filter,
		columns,
		orderBy,
	} = props.displayedState

	return (
		<EntityListSubTree
			entities={{
				...entities,
				filter,
			}}
			treeRootId={treeRootId}
			offset={itemsPerPage === null ? undefined : itemsPerPage * pageIndex}
			limit={itemsPerPage === null ? undefined : itemsPerPage}
			orderBy={orderBy}
			listComponent={Container as any}
			listProps={props}
		>
			{StaticRender && <StaticRender {...props as any} />}
			{Array.from(columns)
				.filter(([key]) => !hiddenColumns[key])
				.map(([key, props]) => (
					<Fragment key={key}>
						{ColumnStaticRender && <ColumnStaticRender column={props} />}
						{props.children}
					</Fragment>
				))}
		</EntityListSubTree>
	)
})
