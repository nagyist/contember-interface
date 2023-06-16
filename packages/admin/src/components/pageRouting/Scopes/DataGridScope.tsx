import { DataBindingProvider } from '@contember/binding'
import { PropsWithChildren, ReactNode } from 'react'
import { DataGrid, DataGridProps, FeedbackRenderer } from '../../bindingFacade'
import { DataGridPageProps } from '../pageComponents'
import { scopeComponent } from './scopeComponent'

export type DataGridScopeProps = PropsWithChildren<DataGridProps<{}>>

/**
 * @group Scopes
 */
export const DataGridScope = scopeComponent(
	(props: DataGridPageProps) => (
		<DataBindingProvider stateComponent={FeedbackRenderer}>
			<DataGrid {...props} />
		</DataBindingProvider>
	),
	'DataGridScope',
)