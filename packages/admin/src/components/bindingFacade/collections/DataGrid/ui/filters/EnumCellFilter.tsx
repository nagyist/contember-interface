import { EnumCellFilterArtifacts, EnumCellRendererProps, LegacyEnumCellArtifacts } from '../../cells'
import { useMemo } from 'react'
import { Checkbox, FieldContainer } from '@contember/ui'
import { FilterRendererProps } from '../../types'
import { NullConditionFilter, NullConditionFilterPublicProps } from './NullConditionFilter'

export type EnumCellFilterExtraProps =
	& NullConditionFilterPublicProps
	& EnumCellRendererProps
	& {
		options: Record<string, string>
	}

export const EnumCellFilter = ({ filter: inFilter, setFilter, environment, field, options, showNullConditionFilter }: FilterRendererProps<EnumCellFilterArtifacts | LegacyEnumCellArtifacts, EnumCellFilterExtraProps>) => {
	const filter = useMemo(() => Array.isArray(inFilter) ? {
		nullCondition: false,
		values: inFilter,
	} : inFilter, [inFilter])
	const values = filter.values

	const checkboxList = Object.entries(options).map(([value, label]) => (
		<FieldContainer
			key={value}
			label={label}
			labelPosition="labelInlineRight"
		>
			<Checkbox
				notNull
				value={values.includes(value)}
				onChange={checked => {
					setFilter({
						...filter,
						values: checked ? [...values, value] : values.filter(it => it !== value),
					})
				}}
			/>
		</FieldContainer>
	))

	return <>
		{checkboxList}
		<NullConditionFilter filter={filter} setFilter={setFilter} environment={environment} field={field} showNullConditionFilter={showNullConditionFilter} />
	</>
}
