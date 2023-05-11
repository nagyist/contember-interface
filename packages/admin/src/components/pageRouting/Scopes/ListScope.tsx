import {
	DataBindingProvider,
	EntityListSubTree,
	EntityListSubTreeAdditionalProps,
	SugaredQualifiedEntityList,
} from '@contember/binding'
import { ReactElement, ReactNode, memo } from 'react'
import { FeedbackRenderer, ImmutableEntityListRenderer, ImmutableEntityListRendererProps } from '../../bindingFacade'

export type ListScopeProps<ContainerExtraProps, ItemExtraProps> =
	& SugaredQualifiedEntityList
	& EntityListSubTreeAdditionalProps
	& {
		children?: ReactNode
		listProps?: Omit<ImmutableEntityListRendererProps<ContainerExtraProps, ItemExtraProps>, 'accessor' | 'children'>
	}

export const ListScope = memo(
	<ContainerExtraProps, ItemExtraProps>({
		children,
		...entityListProps
	}: ListScopeProps<ContainerExtraProps, ItemExtraProps>) => (
		// TODO: Remove this DataBindingProvider and use only the one from parent Pages.tsx
		<DataBindingProvider stateComponent={FeedbackRenderer}>
			<EntityListSubTree {...entityListProps} listComponent={ImmutableEntityListRenderer}>
				{children}
			</EntityListSubTree>
		</DataBindingProvider>
	),
) as (<ContainerExtraProps, ItemExtraProps>(
	props: ListScopeProps<ContainerExtraProps, ItemExtraProps>,
) => ReactElement) &
	Partial<ListScopeProps<never, never>> & {
		displayName?: string;
	}

ListScope.displayName = 'ListScope'