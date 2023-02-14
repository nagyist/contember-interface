import { FilterRendererProps } from '../../types'
import { Checkbox, FieldContainer } from '@contember/ui'

export const HasManyAbsentCellFilter = ({ filter, setFilter }: FilterRendererProps<boolean>) => {
	return (
		<FieldContainer label="Has any" labelPosition="labelInlineRight">
			<Checkbox notNull value={filter} onChange={checked => setFilter(!!checked)} />
		</FieldContainer>
	)
}
