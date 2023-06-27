import { useClassName } from '@contember/utilities'
import { CSSProperties, forwardRef, memo, useMemo } from 'react'
import { HTMLDivElementProps } from '../../types'
import { useFallbackRef } from '../../utils'

export interface GridOwnProps {
	columnWidth: number
}

export type GridProps =
	& GridOwnProps
	& HTMLDivElementProps

/**
 * @group UI
 */
export const Grid = memo(forwardRef<HTMLDivElement, GridProps>(({
	className,
	columnWidth,
	children,
	style: styleProp,
	...rest
}, forwardedRef) => {
	if (columnWidth < 0) {
		throw new Error('Column width must be a non-negative number')
	}

	const ref = useFallbackRef(forwardedRef)
	const style: CSSProperties | undefined = useMemo(() => columnWidth ? ({
		['--cui-grid-column-width' as any]: `${columnWidth}px`,
		...styleProp,
	}) : styleProp, [columnWidth, styleProp])

	return (
		<div
			ref={ref}
			className={useClassName('grid', className)}
			style={style}
			{...rest}
		>
			{children}
		</div>
	)
}))
Grid.displayName = 'Grid'
