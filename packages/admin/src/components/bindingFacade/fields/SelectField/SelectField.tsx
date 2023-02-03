import { Component } from '@contember/react-binding'
import { FieldContainer, FieldContainerProps, FieldErrors, getPortalRoot, PublicCommonReactSelectStylesProps, SelectCreateNewWrapper } from '@contember/ui'
import { FunctionComponent, memo } from 'react'
import type { Props as SelectProps } from 'react-select'
import Select from 'react-select'
import { useLabelMiddleware } from '../../environment/LabelMiddleware'
import {
	ChoiceField,
	ChoiceFieldData,
	DynamicSingleChoiceFieldProps,
	StaticSingleChoiceFieldProps,
} from '../ChoiceField'
import { useCommonReactSelectProps } from './useCommonReactSelectProps'

export type SelectFieldProps =
	& SelectFieldInnerPublicProps
	& (
		| StaticSingleChoiceFieldProps
		| DynamicSingleChoiceFieldProps
	)

export const SelectField: FunctionComponent<SelectFieldProps> = Component(
	props => (
		<ChoiceField {...props} >
			{(choiceProps: ChoiceFieldData.SingleChoiceFieldMetadata<any>) => (
				<SelectFieldInner {...props} {...choiceProps} />
			)}
		</ChoiceField>
	),
	'SelectField',
)

export interface SelectFieldInnerPublicProps extends Omit<FieldContainerProps, 'children'> {
	placeholder?: string
	allowNull?: boolean
	reactSelectProps?: Partial<SelectProps<any>>
}

export type SelectFieldInnerProps =
	& ChoiceFieldData.SingleChoiceFieldMetadata
	& SelectFieldInnerPublicProps
	& PublicCommonReactSelectStylesProps
	& { errors: FieldErrors | undefined }

export const SelectFieldInner = memo(
	({
		placeholder,
		allowNull,
		currentValue,
		data,
		errors,
		menuZIndex,
		onSelect,
		onClear,
		reactSelectProps,
		onAddNew,
		onSearch,
		isLoading,
		...fieldContainerProps
	}: SelectFieldInnerProps) => {
		const selectProps = useCommonReactSelectProps({
			reactSelectProps,
			placeholder,
			data,
			isInvalid: (errors?.length ?? 0) > 0,
			onSearch,
			menuZIndex,
		})

		const labelMiddleware = useLabelMiddleware()

		return (
			<FieldContainer
				{...fieldContainerProps}
				errors={errors}
				label={labelMiddleware(fieldContainerProps.label)}
			>
				<SelectCreateNewWrapper onClick={onAddNew}>
					<Select
						{...selectProps}
						menuPlacement="auto"
						menuPortalTarget={getPortalRoot()}
						isClearable={allowNull === true}
						value={currentValue}
						isLoading={isLoading}
						onChange={(newValue, actionMeta) => {
							const value = newValue as ChoiceFieldData.SingleOption
							if (actionMeta.action === 'select-option') {
								onSelect(value)
							} else if (actionMeta.action === 'clear') {
								onClear()
							}
						}}
					/>
				</SelectCreateNewWrapper>
			</FieldContainer>
		)
	},
)
SelectFieldInner.displayName = 'SelectFieldInner'
