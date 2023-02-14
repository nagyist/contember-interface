import { DataBindingProvider } from '@contember/react-binding'
import { ComponentType, memo, ReactNode } from 'react'
import {
	createDataGrid,
	createDataGridRenderer,
	DataGridColumnPublicProps,
	DataGridContainerPublicProps,
	DataGridPageRenderer,
	DataGridProps,
	FeedbackRenderer,
	LayoutRendererProps,
} from '../../bindingFacade'
import type { PageProvider } from '../Pages'
import { getPageName } from './getPageName'
import { ContainerSpinner } from '@contember/ui'

export type DataGridPageProps =
	& DataGridProps<DataGridContainerPublicProps>
	& {
		pageName?: string
		children?: ReactNode
		rendererProps?: Omit<LayoutRendererProps, 'children'>
	}

const DataGridForPage = createDataGrid(createDataGridRenderer<DataGridColumnPublicProps, DataGridContainerPublicProps>({
		Fallback: ContainerSpinner,
		Container: DataGridPageRenderer,
		StaticRender: props => <>{props.tile}</>,
		ColumnStaticRender: props => <>{props.column.header}</>,
	}),
)

const DataGridPage: Partial<PageProvider<DataGridPageProps>> & ComponentType<DataGridPageProps> = memo(({
		children,
		rendererProps,
		pageName,
		...dataGridProps
	}: DataGridPageProps) => (
		<DataBindingProvider stateComponent={FeedbackRenderer}>
			<DataGridForPage {...dataGridProps} {...rendererProps}>
				{children}
			</DataGridForPage>
		</DataBindingProvider>
	),
)
DataGridPage.displayName = 'DataGridPage'
DataGridPage.getPageName = getPageName

export { DataGridPage }
