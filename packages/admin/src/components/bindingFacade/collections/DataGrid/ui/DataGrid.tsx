import { createControlledDataGrid, createDataGrid, createDataGridRenderer } from '../grid'
import { DataGridColumnPublicProps } from './types'
import { DataGridContainer, DataGridContainerPublicProps } from './rendering'
import { ContainerSpinner } from '@contember/ui'

const DataGridRenderer = createDataGridRenderer<DataGridColumnPublicProps, DataGridContainerPublicProps>({
	Fallback: ContainerSpinner,
	Container: DataGridContainer,
	StaticRender: props => <>{props.tile}</>,
	ColumnStaticRender: props => <>{props.column.header}</>,
})


export const DataGrid = createDataGrid(DataGridRenderer)
export const ControlledDataGrid = createControlledDataGrid(DataGridRenderer)
