import { FieldFallbackView, FieldFallbackViewPublicProps } from '../../../../fieldViews'
import { createHasManySelectCell, createHasManySelectCellRenderer } from '../../cells'
import { DataGridColumnPublicProps } from '../types'
import { SelectCellFilter } from '../filters'

export const HasManySelectCell = createHasManySelectCell<DataGridColumnPublicProps, FieldFallbackViewPublicProps>({
	FilterRenderer: SelectCellFilter,
	ValueRenderer: createHasManySelectCellRenderer({
		FallbackRenderer: FieldFallbackView,
	}),
})
