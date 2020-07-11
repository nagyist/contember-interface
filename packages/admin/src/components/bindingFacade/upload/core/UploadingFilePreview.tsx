import { EntityAccessor, Environment } from '@contember/binding'
import { FileUploadReadyState, SingleFileUploadState } from '@contember/react-client'
import { FilePreview, UploadProgress } from '@contember/ui'
import * as React from 'react'
import { FileDataPopulator } from '../fileDataPopulators'
import { getRelevantPopulators } from './getRelevantPopulators'

export interface UploadingFilePreviewProps {
	batchUpdates: EntityAccessor['batchUpdates']
	environment: Environment
	uploadState: SingleFileUploadState
	populators: Iterable<FileDataPopulator>
	renderFilePreview?: (file: File, previewUrl: string) => React.ReactNode
}

type PopulatorDataState =
	| {
			name: 'uninitialized'
			data?: never
	  }
	| {
			name: 'ready'
			data: any[]
	  }
	| {
			name: 'error'
			data?: never
	  }

export const UploadingFilePreview = React.memo(
	({ uploadState, batchUpdates, environment, populators, renderFilePreview }: UploadingFilePreviewProps) => {
		const uploadStateRef = React.useRef(uploadState)
		const [preparedPopulatorData, setPreparedPopulatorData] = React.useState<PopulatorDataState>({
			name: 'uninitialized',
		})
		const uploadedFile = uploadState.file
		const readyState = uploadState.readyState
		const isMountedRef = React.useRef(true)

		const relevantPopulators = React.useMemo(() => getRelevantPopulators(populators, uploadedFile), [
			populators,
			uploadedFile,
		])

		React.useLayoutEffect(() => {
			uploadStateRef.current = uploadState
		}, [uploadState])

		React.useEffect(() => {
			const currentUploadState = uploadStateRef.current
			const preparePopulators = async () => {
				if (readyState === FileUploadReadyState.Uploading && currentUploadState) {
					const dataPromises = relevantPopulators.map(populator =>
						populator.prepareFileData
							? populator.prepareFileData(currentUploadState.file, currentUploadState.previewUrl)
							: Promise.resolve(),
					)
					setPreparedPopulatorData({ name: 'uninitialized' })
					try {
						const data = await Promise.all(dataPromises)
						if (!isMountedRef.current) {
							return
						}
						setPreparedPopulatorData({
							name: 'ready',
							data,
						})
					} catch (e) {
						setPreparedPopulatorData({
							name: 'error',
						})
					}
				}
			}
			preparePopulators()
		}, [readyState, relevantPopulators])

		React.useEffect(() => {
			if (
				uploadState.readyState !== FileUploadReadyState.Success ||
				preparedPopulatorData.name !== 'ready' ||
				!batchUpdates
			) {
				return
			}

			batchUpdates(() => {
				for (let i = 0; i < relevantPopulators.length; i++) {
					const populator = relevantPopulators[i]
					const preparedData = preparedPopulatorData.data[i]

					populator.populateFileData(
						{
							uploadResult: uploadState.result,
							file: uploadState.file,
							previewUrl: uploadState.previewUrl,
							environment,
							batchUpdates,
						},
						preparedData,
					)
				}
			})
		}, [
			batchUpdates,
			environment,
			preparedPopulatorData.data,
			preparedPopulatorData.name,
			relevantPopulators,
			uploadState,
		])

		React.useEffect(
			() => () => {
				isMountedRef.current = false
			},
			[],
		)

		const getOverlay = (): React.ReactNode => {
			if (uploadState.readyState === FileUploadReadyState.Error && uploadState.error?.endUserMessage) {
				return uploadState.error.endUserMessage
			}
			if (
				uploadState.readyState === FileUploadReadyState.Error ||
				preparedPopulatorData.name === 'error' ||
				uploadState.readyState === FileUploadReadyState.Aborted
			) {
				return `Upload failed`
			}
			if (uploadState.readyState === FileUploadReadyState.Success && preparedPopulatorData.name === 'ready') {
				return undefined
			}
			if (uploadState.readyState === FileUploadReadyState.Uploading) {
				return <UploadProgress progress={uploadState.progress} />
			}
			return <UploadProgress />
		}
		if (!renderFilePreview) {
			return null
		}
		return (
			<FilePreview overlay={getOverlay()}>{renderFilePreview?.(uploadState.file, uploadState.previewUrl)}</FilePreview>
		)
	},
)
UploadingFilePreview.displayName = 'UploadingFilePreview'