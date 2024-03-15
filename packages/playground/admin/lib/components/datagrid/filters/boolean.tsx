import * as React from 'react'
import { ReactNode } from 'react'
import { DataViewBooleanFilterTrigger, DataViewNullFilterTrigger } from '@contember/react-dataview'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import { DataGridActiveFilterUI, DataGridFilterSelectTriggerUI, DataGridSingleFilterUI } from '../ui'
import { DataGridNullFilter } from './common'
import { formatBoolean } from '../../../utils/formatting'
import { Button } from '../../ui/button'
import { dict } from '../../../dict'


export const DataGridBooleanFilterList = ({ name }: {
	name: string
}) => (
	<>
		{[true, false].map(value => (
			<DataViewBooleanFilterTrigger name={name} action={'unset'} value={value} key={value.toString()}>
				<DataGridActiveFilterUI className={'data-[current=none]:hidden'}>
					{formatBoolean(value)}
				</DataGridActiveFilterUI>
			</DataViewBooleanFilterTrigger>
		))}

		<DataViewNullFilterTrigger name={name} action={'unset'}>
			<DataGridActiveFilterUI>
				<span className={'italic'}>{dict.datagrid.na}</span>
			</DataGridActiveFilterUI>
		</DataViewNullFilterTrigger>
	</>
)

export const DataGridBooleanFilterSelect = ({ name, label }: {
	name: string
	label?: ReactNode
}) => (
	<Popover>
		<PopoverTrigger asChild>
			<DataGridFilterSelectTriggerUI>{label}</DataGridFilterSelectTriggerUI>
		</PopoverTrigger>
		<PopoverContent className={'w-52'}>
			<div className={'relative flex flex-col gap-2'}>
				<div className={'flex gap-2'}>
					{[true, false].map(it => (
						<DataViewBooleanFilterTrigger name={name} action={'toggle'} value={it} key={it.toString()}>
							<Button size={'lg'} className={'w-full data-[active]:shadow-inner data-[active]:text-blue-500'}
									variant={'outline'}>

								<span className={'text-xs font-semibold'}>
									{formatBoolean(it)}
								</span>
							</Button>
						</DataViewBooleanFilterTrigger>
					))}
				</div>
				<DataGridNullFilter name={name} />
			</div>
		</PopoverContent>
	</Popover>
)


export const DataGridBooleanFilter = ({ name, label }: {
	name: string
	label: ReactNode
}) => (
	<DataGridSingleFilterUI>
		<DataGridBooleanFilterSelect name={name} label={label} />
		<DataGridBooleanFilterList name={name} />
	</DataGridSingleFilterUI>
)
