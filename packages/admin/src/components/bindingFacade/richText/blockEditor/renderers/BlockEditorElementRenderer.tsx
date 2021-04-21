import { BindingError, EntityAccessor, FieldValue, RelativeEntityList, RelativeSingleField } from '@contember/binding'
import { MutableRefObject, ReactElement } from 'react'
import { RenderElementProps } from 'slate-react'
import { NormalizedBlocks } from '../../../blocks'
import { ElementNode } from '../../baseEditor'
import { isContemberContentPlaceholderElement, isContemberFieldElement, isReferenceElement } from '../elements'
import { NormalizedEmbedHandlers } from '../embed'
import { FieldBackedElement } from '../FieldBackedElement'
import { EditorReferenceBlocks } from '../templating'
import { ContemberFieldElementRenderer } from './ContemberFieldElementRenderer'
import { ContentPlaceholderElementRenderer } from './ContentPlaceholderElementRenderer'
import { ReferenceElementRenderer } from './ReferenceElementRenderer'

export interface BlockEditorElementRendererProps extends RenderElementProps {
	element: ElementNode

	desugaredBlockList: RelativeEntityList
	editorReferenceBlocks: EditorReferenceBlocks
	fallbackRenderer: (props: RenderElementProps) => ReactElement
	getParentEntityRef: MutableRefObject<EntityAccessor.GetEntityAccessor>
	referenceDiscriminationField: RelativeSingleField | undefined

	embedContentDiscriminationField: RelativeSingleField | undefined
	embedSubBlocks: NormalizedBlocks | undefined
	embedHandlers: NormalizedEmbedHandlers | undefined
	embedReferenceDiscriminateBy: FieldValue | undefined

	leadingFields: FieldBackedElement[]
	trailingFields: FieldBackedElement[]
}

export function BlockEditorElementRenderer({
	fallbackRenderer,
	editorReferenceBlocks,
	embedContentDiscriminationField,
	embedHandlers,
	embedReferenceDiscriminateBy,
	embedSubBlocks,
	referenceDiscriminationField,
	leadingFields,
	trailingFields,
	getParentEntityRef,
	desugaredBlockList,
	...renderElementProps
}: BlockEditorElementRendererProps) {
	const { attributes, children, element } = renderElementProps
	if (isReferenceElement(element)) {
		if (referenceDiscriminationField === undefined) {
			throw new BindingError()
		}
		return (
			<ReferenceElementRenderer
				attributes={attributes}
				children={children}
				element={element}
				editorReferenceBlocks={editorReferenceBlocks}
				referenceDiscriminationField={referenceDiscriminationField}
				embedSubBlocks={embedSubBlocks}
				embedHandlers={embedHandlers}
				embedContentDiscriminationField={embedContentDiscriminationField}
				embedReferenceDiscriminateBy={embedReferenceDiscriminateBy}
			/>
		)
	}
	if (isContemberFieldElement(element)) {
		return (
			<ContemberFieldElementRenderer
				attributes={attributes}
				children={children}
				element={element}
				leadingFields={leadingFields}
				trailingFields={trailingFields}
			/>
		)
	}
	if (isContemberContentPlaceholderElement(element)) {
		return (
			<ContentPlaceholderElementRenderer
				attributes={attributes}
				children={children}
				element={element}
				getParentEntityRef={getParentEntityRef}
				desugaredBlockList={desugaredBlockList}
			/>
		)
	}
	return fallbackRenderer(renderElementProps)
}
