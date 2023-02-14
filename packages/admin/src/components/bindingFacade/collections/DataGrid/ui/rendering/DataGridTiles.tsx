import { Entity } from '@contember/react-binding'
import { Grid, useComponentClassName } from '@contember/ui'
import { memo, ReactNode } from 'react'
import { DataGridRenderingCommonProps } from '../types'

export type DataGridTilesPublicProps = {
	tile?: ReactNode
	tileSize?: number
}

export type DataGridTilesProps =
	& DataGridRenderingCommonProps
	& DataGridTilesPublicProps

export const DataGridTiles = memo(({ accessor, tileSize = 160, tile }: DataGridTilesProps) => (
	<div className={useComponentClassName('data-grid-body-content-grid')}>
		<Grid columnWidth={tileSize}>
			{!!accessor.length && Array.from(accessor, entity => (
				<Entity key={entity.id} accessor={entity}>
					{tile}
				</Entity>
			))}
		</Grid>
	</div>
))
DataGridTiles.displayName = 'DataGridTiles'
