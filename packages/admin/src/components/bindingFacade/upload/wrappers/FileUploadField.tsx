// import { Component } from '@contember/binding'
// import type { FunctionComponent } from 'react'
// import type { SimpleRelativeSingleFieldProps } from '../../auxiliary'
// import { UploadField, UploadFieldRenderingProps } from '../oldCore'
// import {
// 	FileDataPopulator,
// 	FileUrlDataPopulator,
// 	GenericFileMetadataPopulator,
// 	GenericFileMetadataPopulatorProps,
// } from '../fileDataPopulators'
// import { getGenericFileDefaults } from '../stockFileKindDefaults'
//
// export type FileUploadFieldProps = SimpleRelativeSingleFieldProps &
// 	UploadFieldRenderingProps &
// 	GenericFileMetadataPopulatorProps & {
// 		additionalFileDataPopulators?: Iterable<FileDataPopulator>
// 	}
//
// // TODO this is super temporary
// export const FileUploadField: FunctionComponent<FileUploadFieldProps> = Component(props => {
// 	const defaults = getGenericFileDefaults(props.field)
// 	return (
// 		<UploadField
// 			{...props}
// 			accept={defaults.accept}
// 			fileUrlField={props.field}
// 			fileDataPopulators={[
// 				...(props.additionalFileDataPopulators || []),
// 				new FileUrlDataPopulator({ fileUrlField: props.field }),
// 				new GenericFileMetadataPopulator(props),
// 			]}
// 			renderFilePreview={defaults.renderFilePreview}
// 			renderFile={defaults.renderFile}
// 		/>
// 	)
// }, 'FileUploadField')
export function FileUploadField(props: any): any {}
