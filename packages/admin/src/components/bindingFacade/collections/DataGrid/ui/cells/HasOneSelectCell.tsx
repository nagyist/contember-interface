import { FieldFallbackView, FieldFallbackViewPublicProps } from '../../../../fieldViews'
import { createHasOneSelectCell, createHasOneSelectCellRenderer } from '../../cells'
import { DataGridColumnPublicProps } from '../types'
import { SelectCellFilter } from '../filters'

export const HasOneSelectCell = createHasOneSelectCell<DataGridColumnPublicProps, FieldFallbackViewPublicProps>({
	FilterRenderer: SelectCellFilter,
	ValueRenderer: createHasOneSelectCellRenderer({
		FallbackRenderer: FieldFallbackView,
	}),
})
