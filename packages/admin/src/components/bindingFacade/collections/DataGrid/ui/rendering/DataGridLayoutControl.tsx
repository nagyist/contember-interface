import { Button, ButtonList, Divider, Icon } from '@contember/ui'
import { DataGridRenderingCommonProps } from '../types'
import useCallback = React.useCallback;
import { ReactNode } from 'react'

export type DataGridLayoutControlPublicProps = {
	tile?: ReactNode
}

export type DataGridLayoutControlProps =
	& DataGridRenderingCommonProps
	& DataGridLayoutControlPublicProps

export const DataGridLayoutControl = ({ stateMethods: { setLayout }, desiredState: { layout }, tile }: DataGridLayoutControlProps) => {
	const setDefaultView = useCallback(() => setLayout('default'), [setLayout])
	const setTileView = useCallback(() => setLayout('tiles'), [setLayout])

	if (!tile) {
		return null
	}

	return <>
		<ButtonList>
			<Button onClick={setTileView} size="small" distinction="seamless" intent={layout === 'tiles' ? 'primary' : 'default'}>
				<Icon blueprintIcon="grid-view" />
			</Button>
			<Button onClick={setDefaultView} size="small" distinction="seamless" intent={layout === 'default' ? 'primary' : 'default'}>
				<Icon blueprintIcon="list" />
			</Button>
		</ButtonList>

		<Divider />
	</>
}
