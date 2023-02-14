import classNames from 'classnames'
import { memo, MouseEventHandler, ReactNode, useContext } from 'react'
import { useComponentClassName } from '../../auxiliary'
import type { Justification } from '../../types'
import { toEnumViewClass, toFeatureClass, toStateClass } from '../../utils'
import { UseTableElementContext } from './Table'

export interface TableRowProps {
	active?: boolean
	children?: ReactNode
	justification?: Justification
	onClick?: MouseEventHandler<HTMLTableRowElement>
}

export const TableRow = memo(({ active, children, justification, onClick: onClick }: TableRowProps) => {
	const useTableElement = useContext(UseTableElementContext)
	const className = classNames(
		useComponentClassName('table-row'),
		toEnumViewClass(justification),
		toFeatureClass('hover', !!onClick),
		toFeatureClass('press', !!onClick),
		toStateClass('active', active),
	)

	if (useTableElement) {
		return <tr onClick={onClick} className={className}>{children}</tr>
	}
	return <div onClick={onClick} className={className}>{children}</div>
})
TableRow.displayName = 'TableRow'
