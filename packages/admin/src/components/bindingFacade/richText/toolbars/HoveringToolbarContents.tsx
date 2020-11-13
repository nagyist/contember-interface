import { EntityKeyProvider, useBindingOperations, useEnvironment, VariableInputTransformer } from '@contember/binding'
import { Dropdown, EditorToolbar, Icon, ToolbarGroup } from '@contember/ui'
import * as React from 'react'
import { Range as SlateRange } from 'slate'
import { useEditor, useSlate } from 'slate-react'
import { BaseEditor } from '../baseEditor'
import { BlockSlateEditor } from '../blockEditor/editor'
import { InitializeReferenceToolbarButton, ToolbarButtonSpec } from './ToolbarButtonSpec'

export interface HoveringToolbarContentsProps {
	buttons: ToolbarButtonSpec[] | ToolbarButtonSpec[][]
}

const RefButton = React.memo(({ button }: { button: InitializeReferenceToolbarButton }) => {
	const editor = useEditor() as BlockSlateEditor
	const environment = useEnvironment()
	const bindingOperations = useBindingOperations()

	const [editorSelection, setEditorSelection] = React.useState<SlateRange | null>(null)
	const [referenceId, setReferenceId] = React.useState<string | undefined>(undefined)

	const Content = button.referenceContent
	return (
		<Dropdown
			onDismiss={React.useCallback(() => {
				if (referenceId === undefined) {
					return
				}
				setEditorSelection(null)
				setReferenceId(undefined)
				bindingOperations.batchDeferredUpdates(({ getEntityByKey }) => getEntityByKey(referenceId).deleteEntity())
			}, [bindingOperations, referenceId])}
			renderToggle={({ ref, onClick }) => (
				<Icon
					blueprintIcon={button.blueprintIcon}
					contemberIcon={button.contemberIcon}
					customIcon={button.customIcon}
					ref={ref}
					onClick={e => {
						if (referenceId) {
							return
						}
						const discriminateBy = VariableInputTransformer.transformVariableLiteral(button.discriminateBy, environment)
						setReferenceId(editor.createElementReference(discriminateBy, button.initializeReference))
						setEditorSelection(editor.selection)
						onClick(e)
					}}
				/>
			)}
		>
			{({ requestClose }) => {
				if (referenceId === undefined) {
					return null
				}
				const cleanUp = () => {
					requestClose()
					setEditorSelection(null)
					setReferenceId(undefined)
				}
				return (
					<EntityKeyProvider entityKey={referenceId}>
						<Content
							referenceId={referenceId}
							editor={editor}
							selection={editorSelection}
							onSuccess={cleanUp}
							onCancel={() => {
								bindingOperations.batchDeferredUpdates(({ getEntityByKey }) =>
									getEntityByKey(referenceId).deleteEntity(),
								)
								cleanUp()
							}}
						/>
					</EntityKeyProvider>
				)
			}}
		</Dropdown>
	)
})

export const HoveringToolbarContents = React.memo(({ buttons: rawButtons }: HoveringToolbarContentsProps) => {
	const editor = useSlate() as BaseEditor

	if (!rawButtons.length) {
		return null
	}
	const buttons = (Array.isArray(rawButtons[0]) ? rawButtons : [rawButtons]) as ToolbarButtonSpec[][]
	const groups: ToolbarGroup[] = buttons.map(
		(buttons): ToolbarGroup => ({
			buttons: buttons
				.map((button): ToolbarGroup['buttons'][number] | undefined => {
					let shouldDisplay: boolean
					let isActive: boolean
					let onMouseDown: () => void

					if ('marks' in button) {
						shouldDisplay = editor.canToggleMarks(button.marks)
						isActive = editor.hasMarks(button.marks)
						onMouseDown = () => {
							editor.toggleMarks(button.marks)
						}
					} else if ('elementType' in button) {
						shouldDisplay = editor.canToggleElement(button.elementType, button.suchThat)
						isActive = editor.isElementActive(button.elementType, button.suchThat)
						onMouseDown = () => {
							editor.toggleElement(button.elementType, button.suchThat)
						}
					} else if ('referenceContent' in button) {
						return {
							label: button.title,
							isActive: false,
							//onMouseDown: (e: React.MouseEvent) => {
							//	e.preventDefault() // This is crucial so that we don't unselect the selected text
							//	e.nativeEvent.stopPropagation() // This is a bit of a hack ‒ so that we don't register this click as a start of a new selection
							//},
							customIcon: <RefButton button={button} />,
						}
					} else {
						return undefined
					}

					if (!shouldDisplay) {
						return undefined
					}

					return {
						label: button.title,
						//layout?: ToolbarButtonLayout
						isActive,
						onMouseDown: (e: React.MouseEvent) => {
							e.preventDefault() // This is crucial so that we don't unselect the selected text
							e.nativeEvent.stopPropagation() // This is a bit of a hack ‒ so that we don't register this click as a start of a new selection
							onMouseDown()
						},
						blueprintIcon: button.blueprintIcon,
						contemberIcon: button.contemberIcon,
						customIcon: button.customIcon,
					}
				})
				.filter<ToolbarGroup['buttons'][number]>((item): item is ToolbarGroup['buttons'][number] => !!item),
		}),
	)

	return <EditorToolbar groups={groups} scope="contextual" />
})
