import {
	DataBindingProvider,
	EntityListSubTree,
	EntityListSubTreeAdditionalProps,
	SugaredQualifiedEntityList,
} from '@contember/react-binding'
import { memo, ReactElement, ReactNode } from 'react'
import { FeedbackRenderer, ImmutableEntityListTablePageRenderer, ImmutableEntityListTablePageRendererProps } from '../../bindingFacade'
import type { PageProvider } from '../Pages'
import { getPageName } from './getPageName'

export type TablePageProps<ContainerExtraProps, ItemExtraProps> =
	& SugaredQualifiedEntityList
	& EntityListSubTreeAdditionalProps
	& {
		pageName?: string
		children?: ReactNode
		rendererProps?: Omit<ImmutableEntityListTablePageRendererProps<ContainerExtraProps, ItemExtraProps>, 'accessor' | 'children'>
	}

const TablePage = memo(
	<ContainerExtraProps, ItemExtraProps>({
		rendererProps,
		children,
		pageName,
		...entityListProps
	}: TablePageProps<ContainerExtraProps, ItemExtraProps>) => (
		<DataBindingProvider stateComponent={FeedbackRenderer}>
			<EntityListSubTree {...entityListProps} listComponent={ImmutableEntityListTablePageRenderer} listProps={rendererProps}>
				{children}
			</EntityListSubTree>
		</DataBindingProvider>
	),
) as (<ContainerExtraProps, ItemExtraProps>(
	props: TablePageProps<ContainerExtraProps, ItemExtraProps>,
) => ReactElement) &
	Partial<PageProvider<TablePageProps<never, never>>>

TablePage.getPageName = getPageName

export { TablePage }
