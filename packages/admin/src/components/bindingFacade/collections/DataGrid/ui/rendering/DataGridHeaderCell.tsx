import type { Environment } from '@contember/react-binding'
import { ActionableBox, Box, Dropdown, DropdownProps, Icon, TableHeaderCell } from '@contember/ui'
import { ComponentType, createElement, ReactElement, useMemo } from 'react'
import {
	DataGridColumnProps,
	DataGridFilterArtifact,
	DataGridOrderDirection,
	DataGridSetFilter,
	DataGridSetOrderBy,
	FilterRendererProps,
} from '../../types'
import { DataGridColumnPublicProps, DataGridRenderingCommonProps } from '../types'
import { Serializable } from '@contember/react-utils'
import { useEnvironment } from '@contember/react-binding'
import useCallback = React.useCallback;


export type DataGridHeaderCellProps =
	& DataGridRenderingCommonProps
	& {
		columnKey: string
		column: DataGridColumnProps<Serializable, DataGridColumnPublicProps>
	}

export function DataGridHeaderCell(props: DataGridHeaderCellProps): ReactElement {
	const {
		columnKey,
		column: { header, headerJustification, justification, shrunk, ascOrderIcon, descOrderIcon },
		stateMethods: { setOrderBy },
		desiredState: { orderDirections },
	} = props
	const orderDirection = orderDirections[columnKey]
	const orderColumns = Object.keys(orderDirections)
	const orderState = orderDirection ? {
		direction: orderDirection,
		index: orderColumns.length > 1 ? orderColumns.indexOf(columnKey) : undefined,
	} : undefined

	return (
		<TableHeaderCell scope="col" justification={headerJustification || justification} shrunk={shrunk}>
			<span style={{ display: 'flex', justifyContent: 'flex-start', gap: '.25em' }}>
				<span onClick={e => setOrderBy(columnKey, 'next', e.ctrlKey || e.metaKey)} style={{ cursor: 'pointer' }}>
					{header}
					&nbsp;
					{orderState &&
						<>
							{{
								asc: ascOrderIcon ?? defaultAscIcon,
								desc: descOrderIcon ?? defaultDescIcon,
							}[orderState.direction]}
							{orderState.index !== undefined ? `(${orderState.index + 1})` : null}
						</>}
				</span>
				<DataGridHeaderCellFilterDropdown {...props} />
			</span>
		</TableHeaderCell>
	)
}


const defaultAscIcon = <Icon blueprintIcon="caret-up" size="small" alignWithLowercase />
const defaultDescIcon = <Icon blueprintIcon="caret-down" size="small" alignWithLowercase />

export type DataGridHeaderCellFilterDropdownProps =
	& DataGridRenderingCommonProps
	& {
		columnKey: string
		column: DataGridColumnProps<Serializable, DataGridColumnPublicProps>
	}

export const DataGridHeaderCellFilterDropdown = (props: DataGridHeaderCellFilterDropdownProps) => {
	const environment = useEnvironment()
	const filterArtifact = props.desiredState.filterArtifacts[props.columnKey]
	const hasFilter = props.column.enableFiltering
		&& filterArtifact !== undefined
		&& props.column.getNewFilter(filterArtifact, { environment }) !== undefined

	const buttonProps: DropdownProps['buttonProps'] = useMemo(() => ({
		intent: hasFilter ? 'primary' : 'default',
		distinction: 'seamless',
		size: 'small',
		children: (
			<Icon
				blueprintIcon="filter"
				alignWithLowercase
				style={{
					opacity: hasFilter ? '1' : '0.5',
				}}
			/>
		),
	}), [hasFilter])

	const setFilter = useCallback((filter: Serializable | undefined) => {
		props.stateMethods.setFilter(props.columnKey, filter)
	}, [props.columnKey, props.stateMethods])

	if (!props.column.enableFiltering) {
		return null
	}

	const filter = filterArtifact ?? props.column.emptyFilter
	const filterRenderer = props.column.filterRenderer

	return (
		<Dropdown
			buttonProps={buttonProps}
			renderContent={({ requestClose }) => (
				<ActionableBox
					onRemove={() => {
						setFilter(undefined)
						requestClose()
					}}
				>
					<Box heading={<>Filter: {props.column.header}</>}>
						{createElement(filterRenderer, {
							filter,
							setFilter: setFilter,
							environment: environment,
						})}
					</Box>
				</ActionableBox>
			)}
		/>
	)
}
