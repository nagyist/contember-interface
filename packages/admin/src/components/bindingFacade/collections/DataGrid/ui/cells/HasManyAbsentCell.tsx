import { createHasManyAbsentCell } from '../../cells'
import { HasManyAbsentCellFilter } from '../filters'
import { DataGridColumnPublicProps } from '../types'

export const HasManyAbsentCell = createHasManyAbsentCell<DataGridColumnPublicProps>({
	FilterRenderer: HasManyAbsentCellFilter,
})
