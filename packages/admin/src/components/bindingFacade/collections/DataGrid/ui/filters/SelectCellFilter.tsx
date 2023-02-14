import { Checkbox, FieldContainer } from '@contember/ui'
import { useMemo } from 'react'
import { useMessageFormatter } from '../../../../../../i18n'
import { ChoiceFieldData, MultiSelectFieldInner } from '../../../../fields'
import { dataGridCellsDictionary } from '../dict/dataGridCellsDictionary'
import { EntityAccessor } from '@contember/react-binding'

import { FilterRendererProps } from '../../types'
import { SelectCellArtifacts, SelectCellFilterExtraProps } from '../../cells'

type SelectCellFilterProps =
	& FilterRendererProps<SelectCellArtifacts>
	& SelectCellFilterExtraProps

export const SelectCellFilter = ({ filter, setFilter, options, allOptions, onSearch, isLoading }: SelectCellFilterProps) => {
	const currentValues = useMemo<ChoiceFieldData.Options<EntityAccessor>>(() => {
		return allOptions.filter(it => filter.id.includes(it.value.id))
	}, [filter.id, allOptions])
	const formatMessage = useMessageFormatter(dataGridCellsDictionary)

	return <>
		<MultiSelectFieldInner
			label={undefined}
			data={options}
			onAdd={(val: ChoiceFieldData.SingleOption<EntityAccessor>) => setFilter({ ...filter, id: [...filter.id, val.value.id] })}
			onRemove={val => setFilter({ ...filter, id: filter.id.filter(it => it !== val.value.id) })}
			errors={undefined}
			currentValues={currentValues}
			onClear={() => {
				setFilter({ ...filter, id: [] })
			}}
			onSearch={onSearch}
			isLoading={isLoading}
		/>

		<FieldContainer
			label={<span style={{ whiteSpace: 'nowrap' }}>
				{formatMessage('dataGridCells.textCell.includeNull', {
					strong: chunks => <strong>{chunks}</strong>,
				})}
			</span>}
			labelPosition="labelInlineRight"
		>
			<Checkbox
				notNull
				value={filter.nullCondition}
				onChange={checked => {
					setFilter({
						...filter,
						nullCondition: !!checked,
					})
				}}
			/>
		</FieldContainer>
	</>
}
