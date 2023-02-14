import { ComponentType, memo } from 'react'
import { Stack, useComponentClassName } from '@contember/ui'
import { DataGridHeader } from './DataGridHeader'
import { DataGridContent } from './DataGridContent'
import { DataGridFooter } from './DataGridFooter'
import { DataGridRenderingCommonProps } from '../types'


export const createDataGridContainer = <HeaderProps extends {}, ContentProps extends {}, FooterProps extends {}>({ Header, Content, Footer }: {
	Header: ComponentType<HeaderProps & DataGridRenderingCommonProps>,
	Content: ComponentType<ContentProps & DataGridRenderingCommonProps>,
	Footer: ComponentType<FooterProps & DataGridRenderingCommonProps>,
}) => memo<HeaderProps & ContentProps & FooterProps & DataGridRenderingCommonProps>(props => {
	const componentClassName = useComponentClassName('data-grid')

	return (
		<Stack direction="vertical" className={`${componentClassName}-body`}>
			<Header {...props} />
			<Content {...props} />
			<Footer {...props} />
		</Stack>
	)
})


export type DataGridContainerProps = typeof DataGridContainer extends ComponentType<infer P> ? P : never
export type DataGridContainerPublicProps = Omit<DataGridContainerProps, keyof DataGridRenderingCommonProps>

export const DataGridContainer = createDataGridContainer({
	Header: DataGridHeader,
	Content: DataGridContent,
	Footer: DataGridFooter,
})
