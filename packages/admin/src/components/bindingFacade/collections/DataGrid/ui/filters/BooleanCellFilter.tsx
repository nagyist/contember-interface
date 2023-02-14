import { FilterRendererProps } from '../../types'
import { BooleanFilterArtifacts } from '../../cells'
import { useMessageFormatter } from '../../../../../../i18n'
import { dataGridCellsDictionary } from '../dict/dataGridCellsDictionary'
import { Checkbox, FieldContainer, Stack } from '@contember/ui'

export const BooleanCellFilter = ({ setFilter, filter }: FilterRendererProps<BooleanFilterArtifacts>) => {
	const formatMessage = useMessageFormatter(dataGridCellsDictionary)
	return (
		<Stack direction="horizontal">
			{(
				[
					['includeTrue', formatMessage('dataGridCells.booleanCell.includeTrue')],
					['includeFalse', formatMessage('dataGridCells.booleanCell.includeFalse')],
					['includeNull', formatMessage('dataGridCells.booleanCell.includeNull')],
				] as const
			).map(([item, label], index) => (
				<FieldContainer
					key={`${index}-${label}`}
					label={label}
					labelPosition="labelInlineRight"
				>
					<Checkbox
						key={item}
						notNull
						value={filter[item]}
						onChange={checked => {
							setFilter({ ...filter, [item]: checked })
						}}
					/>
				</FieldContainer>
			))}
		</Stack>
	)
}
