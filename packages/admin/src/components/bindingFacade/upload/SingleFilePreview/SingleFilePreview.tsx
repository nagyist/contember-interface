import type { EntityAccessor } from '@contember/binding'
import type { FileId, SingleFileUploadState } from '@contember/react-client'
import { ActionableBox, Box } from '@contember/ui'
import { memo, ReactElement, useMemo } from 'react'
import type { FullFileKind } from '../interfaces'
import type { ResolvedFileKinds } from '../ResolvedFileKinds'
import { getEntityFileKind } from '../utils'
import { InitializedFilePreview } from './InitializedFilePreview'
import { InitializingFilePreview } from './InitializingFilePreview'
import { UploadedFilePreview } from './UploadedFilePreview'

export interface SingleFilePreviewProps {
	getContainingEntity: EntityAccessor.GetEntityAccessor
	fileId: FileId
	hasUploadedFile: (fileId: FileId) => boolean
	removeFile: ((fileId: FileId) => void) | undefined
	uploadState: SingleFileUploadState | undefined
	fileKinds: ResolvedFileKinds
}

export const SingleFilePreview = memo(
	({ fileId, fileKinds, getContainingEntity, hasUploadedFile, removeFile, uploadState }: SingleFilePreviewProps) => {
		let fileKind: FullFileKind
		let preview: ReactElement | null = null

		const onRemove = useMemo(() => {
			if (!removeFile) {
				return undefined
			}
			return () => {
				removeFile(fileId)
			}
		}, [fileId, removeFile])

		if (uploadState !== undefined) {
			if (uploadState.readyState === 'initializing') {
				return <InitializingFilePreview />
			}
			fileKind = getEntityFileKind(fileKinds, getContainingEntity)
			preview = (
				<InitializedFilePreview
					fileKind={fileKind}
					getContainingEntity={getContainingEntity}
					uploadState={uploadState}
				/>
			)
		} else if (hasUploadedFile(fileId)) {
			fileKind = getEntityFileKind(fileKinds, getContainingEntity)
			preview = <UploadedFilePreview fileKind={fileKind} />
		} else {
			return null
		}
		const editContents = fileKind.children ? <Box>{fileKind.children}</Box> : undefined
		return (
			<ActionableBox onRemove={onRemove} editContents={editContents}>
				{preview}
			</ActionableBox>
		)
	},
)
SingleFilePreview.displayName = 'SingleFilePreview'
