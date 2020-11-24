import * as React from 'react'
import cn from 'classnames'
import { useClassNamePrefix } from '../../auxiliary'
import { toViewClass } from '../../utils'

export interface EditorHeadingProps {
	level: 1 | 2 | 3 | 4 | 5 | 6
	isNumbered?: boolean
	attributes: React.HTMLAttributes<HTMLHeadingElement>
	children: React.ReactNode
}

export function EditorHeading({ level, isNumbered, attributes, children }: EditorHeadingProps) {
	const prefix = useClassNamePrefix()
	return React.createElement(
		`h${level}` as 'h1', // Casting just to type-check the rest better.
		{
			...attributes,
			className: cn(`${prefix}editorHeading`, toViewClass('numbered', isNumbered)),
		},
		children,
	)
}