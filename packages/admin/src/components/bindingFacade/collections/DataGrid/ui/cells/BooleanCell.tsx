import { createBooleanCell } from '../../cells'
import { BooleanCellFilter } from '../filters'
import { BooleanFieldView, BooleanFieldViewProps } from '../../../../fieldViews'
import { DataGridColumnPublicProps } from '../types'
import { Component, SugarableRelativeSingleField } from '@contember/react-binding'

export const BooleanCell = createBooleanCell<DataGridColumnPublicProps, BooleanFieldViewProps>({
	FilterRenderer: BooleanCellFilter,
	ValueRenderer: Component<Omit<BooleanFieldViewProps, 'field'> & {
		field: string | SugarableRelativeSingleField
	}>(({ field, ...props }) => {
		return <BooleanFieldView field={{ field }} {...props} />
	}),
})
