import { Component } from '@contember/binding'
import type { S3FileUploader } from '@contember/client'
import { emptyArray } from '@contember/react-utils'
import type { ReactElement } from 'react'
import { ImageFieldView } from '../../fieldViews'
import { defaultUploader } from '../defaultUploader'
import type {
	FileUrlDataExtractorProps,
	GenericFileMetadataExtractorProps,
	ImageFileDataExtractorProps,
} from '../fileDataExtractors'
import {
	getFileUrlDataExtractor,
	getGenericFileMetadataExtractor,
	getImageFileDataExtractor,
} from '../fileDataExtractors'
import { FileKind } from '../FileKind'
import type {
	AcceptFileOptions,
	DiscriminatedFileKind,
	FileDataExtractor,
	RenderFilePreviewOptions,
} from '../interfaces'

export interface ImageFileKindProps<AcceptArtifacts = unknown, FileData = unknown>
	extends Partial<
			Omit<
				DiscriminatedFileKind<S3FileUploader.SuccessMetadata, AcceptArtifacts, FileData>,
				'discriminateBy' | 'extractors'
			>
		>,
		Required<FileUrlDataExtractorProps>,
		GenericFileMetadataExtractorProps,
		ImageFileDataExtractorProps {
	discriminateBy: DiscriminatedFileKind['discriminateBy']
	additionalExtractors?: FileDataExtractor<FileData, S3FileUploader.SuccessMetadata, AcceptArtifacts>[]
}

export const acceptImageFile = ({ file }: AcceptFileOptions) => file.type.startsWith('image')
export const renderImageFilePreview = ({ objectUrl }: RenderFilePreviewOptions) => <img src={objectUrl} alt="" />

export const ImageFileKind = Component<ImageFileKindProps>(
	({
		discriminateBy,
		additionalExtractors = emptyArray,
		acceptMimeTypes = 'image/*',
		acceptFile = acceptImageFile,
		children,
		fileSizeField,
		fileTypeField,
		lastModifiedField,
		fileNameField,
		renderFilePreview = renderImageFilePreview,
		renderUploadedFile,
		heightField,
		widthField,
		uploader = defaultUploader,
		urlField,
	}) => {
		const extractors: FileDataExtractor<unknown, S3FileUploader.SuccessMetadata>[] = [
			getFileUrlDataExtractor({ urlField }),
			getGenericFileMetadataExtractor({ fileNameField, fileSizeField, fileTypeField, lastModifiedField }),
			getImageFileDataExtractor({ heightField, widthField }),
			...additionalExtractors,
		]
		const renderUploadedImage = renderUploadedFile ?? <ImageFieldView srcField={urlField} />
		return (
			<FileKind
				discriminateBy={discriminateBy}
				acceptMimeTypes={acceptMimeTypes}
				acceptFile={acceptFile}
				renderFilePreview={renderFilePreview}
				renderUploadedFile={renderUploadedImage}
				uploader={uploader}
				extractors={extractors}
				children={children}
			/>
		)
	},
	'ImageFileKind',
) as <AcceptArtifacts = unknown, FileData = unknown>(
	props: ImageFileKindProps<AcceptArtifacts, FileData>,
) => ReactElement | null
