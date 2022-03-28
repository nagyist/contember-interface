import classNames from 'classnames'
import { memo, ReactNode } from 'react'
import { useClassNamePrefix } from '../auxiliary'
import { toEnumClass, toThemeClass } from '../utils'
import { ButtonList } from './Forms'
import { useThemeScheme, useTitleThemeScheme } from './Layout/ThemeSchemeContext'
import type { ThemeScheme } from './Layout/Types'
import { Heading, HeadingProps } from './Typography/Heading'

export interface TitleBarProps extends ThemeScheme {
	after?: ReactNode
	navigation?: ReactNode // This can contain any number of buttons but only buttons
	children: ReactNode
	headingProps?: HeadingProps
	actions?: ReactNode // This can contain any number of buttons but only buttons
}

export const TitleBar = memo(({ after, navigation, children, headingProps, actions, ...props }: TitleBarProps) => {
	const prefix = useClassNamePrefix()
	const {
		scheme,
		theme,
		themeContent,
		themeControls,
	} = useTitleThemeScheme(props)

	const { scheme: layoutScheme } = useThemeScheme({})

	return (
		<div className={classNames(
			`${prefix}titleBar`,
			toThemeClass(themeContent ?? theme, 'content'),
			toThemeClass(themeControls ?? theme, 'controls'),
			toEnumClass('scheme-', scheme),
			scheme !== layoutScheme ? 'is-global-theme' : undefined,
		)}>
			{navigation && (
				<nav className={`${prefix}titleBar-navigation`}>
					<ButtonList>{navigation}</ButtonList>
				</nav>
			)}
			<div className={`${prefix}titleBar-in`}>
				<div className={`${prefix}titleBar-heading`}>
					<Heading {...{ depth: 2, ...headingProps }}>{children}</Heading>
				</div>
				{actions && (
					<div className={`${prefix}titleBar-actions`}>
						<ButtonList>{actions}</ButtonList>
					</div>
				)}
			</div>
			{after && <div className={`${prefix}titleBar-after`}>
				{after}
			</div>}
		</div>
	)
})
TitleBar.displayName = 'TitleBar'
