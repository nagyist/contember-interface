import { BindingError } from '@contember/react-binding'
import type { ReactElement } from 'react'
import { DataGridColumnProps, DataGridFilterArtifact } from '../types'

// This is deliberately not a Component!
export const DataGridColumn: <FA extends DataGridFilterArtifact = DataGridFilterArtifact, ColumnProps extends {} = {}>(
	props: DataGridColumnProps<FA>,
) => ReactElement = <FA extends DataGridFilterArtifact = DataGridFilterArtifact>(
	props: DataGridColumnProps<FA>,
): ReactElement => {
	throw new BindingError()
}
