import { Box, Checkbox, Dropdown, DropdownProps, FieldContainer, Icon } from '@contember/ui'
import { Fragment, ReactElement, useMemo } from 'react'
import { useMessageFormatter } from '../../../../../../i18n'
import { dataGridDictionary } from '../dict/dataGridDictionary'
import { DataGridRenderingCommonProps } from '../types'

export type DataGridColumnHidingPublicProps = {
	allowColumnVisibilityControls?: boolean
}

export type DataGridColumnHidingProps =
	& DataGridRenderingCommonProps
	& DataGridColumnHidingPublicProps

export const DataGridColumnHiding = ({
	desiredState,
	displayedState,
	stateMethods: { setIsColumnHidden },
	allowColumnVisibilityControls,
}: DataGridColumnHidingProps): ReactElement | null => {
	const formatMessage = useMessageFormatter(dataGridDictionary)
	const buttonProps: DropdownProps['buttonProps'] = useMemo(() => ({
		intent: 'default',
		distinction: 'seamless',
		children: (
			<>
				<Icon blueprintIcon="list-columns" alignWithLowercase style={{ marginRight: '0.4em' }} />
				{formatMessage('dataGrid.columnHiding.showMenuButton.text')}
			</>
		),
	}), [formatMessage])

	if (!allowColumnVisibilityControls || displayedState.layout === 'tiles') {
		return null
	}

	return (
		<Dropdown
			alignment="end"
			buttonProps={buttonProps}
		>
			<Box heading={formatMessage('dataGrid.columnHiding.heading')}>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.25em' }}>
					{Array.from(desiredState.columns, ([key, column]) => {
						if (column.canBeHidden === false) {
							return <Fragment key={key} />
						}
						return (
							<FieldContainer
								key={key}
								label={column.header}
								labelPosition="labelInlineRight"
							>
								<Checkbox
									notNull
									value={!desiredState.hiddenColumns[key]}
									onChange={isChecked => setIsColumnHidden(key, !isChecked)}
								/>
							</FieldContainer>
						)
					})}
				</div>
			</Box>
		</Dropdown>
	)
}
