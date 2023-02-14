import { createCoalesceCell } from '../../cells'
import { GenericTextCellFilter } from '../filters'
import { CoalesceFieldView, CoalesceFieldViewProps } from '../../../../fieldViews'
import { Stack } from '@contember/ui'
import { DataGridColumnPublicProps } from '../types'

export const CoalesceCell = createCoalesceCell<DataGridColumnPublicProps, CoalesceFieldViewProps>({
	FilterRenderer: props => {
		return (
			<Stack direction="horizontal">
				<GenericTextCellFilter {...props} />
			</Stack>
		)
	},
	ValueRenderer: CoalesceFieldView,
})
