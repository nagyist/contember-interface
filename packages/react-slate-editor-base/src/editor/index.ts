import {
	addMarks,
	canToggleMark,
	closest,
	closestBlockEntry,
	closestViableBlockContainerEntry,
	ejectElement,
	elementToSpecifics,
	getElementDataAttributes,
	getPreviousSibling,
	hasMarks,
	hasParentOfType,
	isElementType,
	permissivelyDeserializeNodes,
	removeMarks,
	serializeNodes,
	strictlyDeserializeNodes,
	textToSpecifics,
	toLatestFormat,
	topLevelNodes,
} from './methods'

export type { ElementDataAttributes } from './methods'

// TODO use export * as ContemberEditor from './methods' once the tooling is ready.
export const ContemberEditor = {
	addMarks,
	canToggleMark,
	closest,
	closestBlockEntry,
	closestViableBlockContainerEntry,
	ejectElement,
	elementToSpecifics,
	getElementDataAttributes,
	getPreviousSibling,
	hasMarks,
	hasParentOfType,
	isElementType,
	permissivelyDeserializeNodes,
	removeMarks,
	serializeNodes,
	strictlyDeserializeNodes,
	textToSpecifics,
	toLatestFormat,
	topLevelNodes,
}

export * from './createEditor'
