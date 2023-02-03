import type { SugaredFieldProps } from '@contember/react-binding'
import { SugaredField } from '@contember/react-binding'
import { FileDataExtractor } from './FileDataExtractor'

export interface AudioFileDataExtractorProps {
	durationField?: SugaredFieldProps['field']
}

export const getAudioFileDataExtractor: (props: AudioFileDataExtractorProps) => FileDataExtractor<HTMLAudioElement> = ({
	durationField,
}) => ({
	staticRender: () => !!durationField && <SugaredField field={durationField} />,
	extractFileData: ({ objectUrl }) => {
		if (!durationField) {
			return null
		}
		return new Promise((resolve, reject) => {
			const audio = document.createElement('audio')
			audio.addEventListener('canplay', () => {
				resolve(audio)
			})
			audio.addEventListener('error', () => {
				reject()
			})
			audio.src = objectUrl
		})
	},
	populateFields: ({ entity, extractedData }) => {
		!!durationField && entity.getField(durationField).updateValue(extractedData.duration)
	},
})
