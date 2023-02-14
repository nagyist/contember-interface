import { FieldFallbackView, FieldFallbackViewPublicProps } from '../../../../fieldViews'
import { Component, Field } from '@contember/react-binding'
import { createTextCell, TextCellRendererProps } from '../../cells'
import { ReactNode } from 'react'
import { DataGridColumnPublicProps } from '../types'
import { TextCellFilter } from '../filters'

export type TextCellValueRendererProps =
	& TextCellRendererProps
	& FieldFallbackViewPublicProps
	& {
		format?: (value: string | null) => ReactNode
	}

export const TextCell = createTextCell<DataGridColumnPublicProps, TextCellValueRendererProps>({
	FilterRenderer: TextCellFilter,
	ValueRenderer: Component<TextCellValueRendererProps>(props => {
		return <Field<string>
			{...props}
			format={value => {
				if (value === null) {
					return <FieldFallbackView fallback={props.fallback} fallbackStyle={props.fallbackStyle} />
				}
				if (props.format) {
					return props.format(value as any)
				}
				return value
			}}
		/>
	}),
})


