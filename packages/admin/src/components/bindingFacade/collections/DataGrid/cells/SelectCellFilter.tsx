import { Checkbox, FieldContainer } from '@contember/ui'
import { useMemo } from 'react'
import { useMessageFormatter } from '../../../../../i18n'
import { BaseDynamicChoiceField, ChoiceFieldData, MultiSelectFieldInner } from '../../../fields'
import { useSelectOptions } from '../../../fields/ChoiceField/hooks/useSelectOptions'
import { FilterRendererProps } from '../base'
import { dataGridCellsDictionary } from './dataGridCellsDictionary'
import { EntityAccessor, EntityId } from '@contember/react-binding'
import { useCurrentlyChosenEntities } from '../../../fields/ChoiceField/hooks/useCurrentlyChosenEntities'


export type SelectCellArtifacts = {
	id: EntityId[]
	nullCondition: boolean
}
type SelectCellFilterProps =
	& FilterRendererProps<SelectCellArtifacts>
	& {
		optionProps: BaseDynamicChoiceField
	}

export const SelectCellFilter = ({ filter, setFilter, optionProps }: SelectCellFilterProps) => {
	const currentlyChosenEntities = useCurrentlyChosenEntities(optionProps, filter.id)
	const { options, allOptions, onSearch, isLoading } = useSelectOptions(optionProps, currentlyChosenEntities)
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
