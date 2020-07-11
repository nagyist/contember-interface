import { Component } from '@contember/binding'
import * as React from 'react'
import { SimpleRelativeSingleFieldProps } from '../../auxiliary'
import { FileUrlFieldView } from '../../fieldViews'
import {
	FileDataPopulator,
	FileUrlDataPopulator,
	GenericFileMetadataPopulator,
	GenericFileMetadataPopulatorProps,
} from '../fileDataPopulators'
import { UploadField } from '../core'
import { getGenericFileDefaults } from '../stockFileKindDefaults'

export type FileUploadFieldProps = SimpleRelativeSingleFieldProps &
	GenericFileMetadataPopulatorProps & {
		additionalFileDataPopulators?: Iterable<FileDataPopulator>
	}

// TODO this is super temporary
export const FileUploadField = Component<FileUploadFieldProps>(props => {
	const defaults = getGenericFileDefaults(props.field)
	return (
		<UploadField
			{...props}
			accept={defaults.accept}
			fileUrlField={props.field}
			fileDataPopulators={[
				...(props.additionalFileDataPopulators || []),
				new FileUrlDataPopulator({ fileUrlField: props.field }),
				new GenericFileMetadataPopulator(props),
			]}
			renderFilePreview={defaults.renderFilePreview}
			renderFile={defaults.renderFile}
		/>
	)
}, 'FileUploadField')