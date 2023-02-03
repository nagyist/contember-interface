import type { SugaredFieldProps } from '@contember/react-binding'
import { QueryLanguage, SugaredField } from '@contember/react-binding'
import type { S3FileUploader } from '@contember/client'
import { FileDataExtractor } from './FileDataExtractor'

export interface FileUrlDataExtractorProps {
	urlField: SugaredFieldProps['field']
}

export const getFileUrlDataExtractor: (
	props: FileUrlDataExtractorProps,
) => FileDataExtractor<unknown, S3FileUploader.SuccessMetadata> = ({ urlField }) => ({
	staticRender: () => <SugaredField field={urlField} />,
	populateFields: ({ entity, uploadResult }) => {
		if (!uploadResult.fileUrl || typeof uploadResult.fileUrl !== 'string') {
			return
		}
		entity.getField(urlField).updateValue(uploadResult.fileUrl)
	},
	getErrorsHolders: ({ entity, environment }) => {
		const desugaredUrlField = QueryLanguage.desugarRelativeSingleField(urlField, environment)
		const owningEntity = entity.getRelativeSingleEntity({
			hasOneRelationPath: desugaredUrlField.hasOneRelationPath,
		})
		return [entity.getField(urlField), owningEntity]
	},
})
