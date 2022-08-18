import {
	AnchorButton,
	Button,
	Component,
	CreatePage,
	DataGridPage,
	DateFieldView,
	DeleteEntityButton,
	EditPage,
	Entity,
	EntityAccessor,
	EntityListBaseProps,
	Field,
	FieldMarker,
	generateUuid,
	GenericCell,
	HasMany,
	HasManyRelationMarker,
	HasOneRelationMarker,
	Icon,
	Link,
	LinkButton,
	MultiSelectField,
	PersistButton,
	PRIMARY_KEY_NAME,
	TextCell,
	TextField,
	useAuthedContentMutation,
	useCurrentRequest,
	useEntity,
	useEntityList,
	useRedirect,
	useShowToast,
} from '@contember/admin'
import { ContentField } from '../components/ContentField'
import { ReactNode } from 'react'

export const List = () => <DataGridPage
	entities="Page"
	itemsPerPage={20}
	rendererProps={{
		actions: <LinkButton to="page/create">New page</LinkButton>,
		title: 'Pages',
	}}
>
	<TextCell field="internalName" header="Internal name" />
	<GenericCell canBeHidden={false} justification="justifyEnd">
		<LinkButton to={`page/edit(id: $entity.id)`} Component={AnchorButton}>Edit</LinkButton>
		<DeleteEntityButton title="Delete" immediatePersist={true} />
	</GenericCell>
</DataGridPage>


interface CopyEntityArgs {
	copier: EntityCopier,
	source: EntityAccessor,
	target: EntityAccessor
}

interface CopyHasOneRelationArgs {
	copier: EntityCopier,
	source: EntityAccessor,
	target: EntityAccessor,
	marker: HasOneRelationMarker
}

interface CopyHasManyRelationArgs {
	copier: EntityCopier,
	source: EntityAccessor,
	target: EntityAccessor,
	marker: HasManyRelationMarker
}

interface CopyColumnArgs {
	copier: EntityCopier,
	source: EntityAccessor,
	target: EntityAccessor,
	marker: FieldMarker
}

interface CopyHandler {
	copy?(args: CopyEntityArgs): boolean

	copyHasOneRelation?(args: CopyHasOneRelationArgs): boolean

	copyHasManyRelation?(args: CopyHasManyRelationArgs): boolean

	copyColumn?(args: CopyColumnArgs): boolean
}

class ContentCopyHandler implements CopyHandler {
	constructor(
		private blockEntity: string,
		private contentField: string,
		private referencesField: string,
	) {
	}

	copyColumn({ source, marker }: CopyColumnArgs): boolean {
		return source.name === this.blockEntity && marker.fieldName === this.contentField
	}

	copyHasManyRelation({ source, target, copier, marker }: CopyHasManyRelationArgs): boolean {
		if (source.name !== this.blockEntity || marker.parameters.field !== this.referencesField) {
			return false
		}
		const list = source.getEntityList(marker.parameters)
		const targetList = target.getEntityList(marker.parameters)

		targetList.disconnectAll()
		const referenceMapping = new Map<string, string>()
		for (const subEntity of list) {
			const newId = generateUuid()
			referenceMapping.set(subEntity.id as string, newId)
			targetList.createNewEntity(target => {
				copier.copy(subEntity, target())
				target().getField(PRIMARY_KEY_NAME).updateValue(newId)
			})
		}
		const jsonRaw = source.getField(this.contentField).value
		if (typeof jsonRaw !== 'string') {
			return true
		}
		const jsonValue = JSON.parse(jsonRaw, (key, value) => {
			if (key === 'referenceId') {
				return referenceMapping.get(value)
			}
			return value
		})
		target.getField(this.contentField).updateValue(JSON.stringify(jsonValue))

		return true
	}
}

class EntityCopier {
	constructor(
		private handlers: CopyHandler[] = [],
	) {
	}

	copy(source: EntityAccessor, target: EntityAccessor) {
		for (const handler of this.handlers) {
			if (handler.copy?.({ copier: this, source, target })) {
				return
			}
		}
		for (const [, marker] of source.getMarker().fields.markers) {
			if (marker instanceof FieldMarker) {
				this.copyColumn(source, target, marker)

			} else if (marker instanceof HasOneRelationMarker) {
				this.copyHasOneRelation(source, target, marker)

			} else if (marker instanceof HasManyRelationMarker) {
				this.copyHasManyRelation(source, target, marker)
			}
		}
	}

	public copyHasOneRelation(source: EntityAccessor, target: EntityAccessor, marker: HasOneRelationMarker) {
		for (const handler of this.handlers) {
			if (handler.copyHasOneRelation?.({ copier: this, source, target, marker })) {
				return
			}
		}
		const subEntity = source.getEntity(marker.parameters)
		if (marker.parameters.expectedMutation === 'connectOrDisconnect') {
			if (!subEntity.existsOnServer && subEntity.hasUnpersistedChanges) {
				throw 'cannot copy'
			}
			target.connectEntityAtField(marker.parameters.field, subEntity)
		} else if (marker.parameters.expectedMutation === 'anyMutation' || marker.parameters.expectedMutation === 'createOrDelete') {
			const subTarget = target.getEntity(marker.parameters)
			this.copy(subEntity, subTarget)
		}
	}

	public copyHasManyRelation(source: EntityAccessor, target: EntityAccessor, marker: HasManyRelationMarker) {
		for (const handler of this.handlers) {
			if (handler.copyHasManyRelation?.({ copier: this, source, target, marker })) {
				return
			}
		}
		const list = source.getEntityList(marker.parameters)
		const targetList = target.getEntityList(marker.parameters)
		if (marker.parameters.expectedMutation === 'connectOrDisconnect') {
			for (const subEntity of list) {
				if (!subEntity.existsOnServer && subEntity.hasUnpersistedChanges) {
					throw 'cannot copy'
				}
				targetList.connectEntity(subEntity)
			}
		} else if (marker.parameters.expectedMutation === 'anyMutation' || marker.parameters.expectedMutation === 'createOrDelete') {
			targetList.disconnectAll()
			for (const subEntity of list) {
				targetList.createNewEntity(target => {
					this.copy(subEntity, target())
				})
			}
		}
	}

	public copyColumn(source: EntityAccessor, target: EntityAccessor, marker: FieldMarker) {
		if (marker.fieldName === PRIMARY_KEY_NAME) {
			return
		}
		for (const handler of this.handlers) {
			if (handler.copyColumn?.({ copier: this, source, target, marker })) {
				return
			}
		}
		const sourceValue = source.getField(marker.fieldName).value
		target.getField(marker.fieldName).updateValue(sourceValue)
	}
}

const RevisionForm = Component(() => {
	return (
		<>
			<MultiSelectField field={'tags'} label={'Tags'} options={'Tag.name'} />
			<ContentField field={'content'} />
		</>
	)
})


const HidePersistedRevision = Component<{ children: ReactNode }>(
	({ children }) => {
		const entity = useEntity()
		if (entity.existsOnServer) {
			return null
		}
		return <>{children}</>
	},
	({ children }) => <>{children}</>,
)

const RevisionListRenderer = ({
																accessor,
																activeRevision,
															}: EntityListBaseProps & { activeRevision: EntityAccessor }) => {
	const requestRevision = useCurrentRequest()?.parameters.revision
	const revisions = Array.from(accessor)
	return (
		<ul>
			{revisions.map((entity, index) => {
				const isCurrent = requestRevision === entity.id || (!requestRevision && index === revisions.length - 1)
				return (
					<Entity key={entity.key} accessor={entity}>
						<li style={{ listStyleType: 'none' }}>
							<Link to={'page/edit(id: $request.id, revision: $entity.id)'}>
								<span style={{ color: '#000', fontWeight: isCurrent ? 'bold' : 'normal' }}>
									{entity.id === activeRevision.id
										? <Icon blueprintIcon={'eye-open'} />
										: <Icon blueprintIcon={'circle'} style={{ color: '#666' }} />}
									{' '}<DateFieldView field={'createdAt'} />
								</span>
							</Link>
						</li>
					</Entity>
				)
			})}
		</ul>
	)
}

const RevisionList = Component(() => {
	const activeRevision = useEntity('activeRevision')
	return <HasMany field={'revisions'} orderBy={'createdAt asc'} initialEntityCount={0}
									listComponent={RevisionListRenderer} listProps={{ activeRevision }} />
}, () => <>
	<Field field={'activeRevision.id'} />
	<HasMany field={'revisions'} orderBy={'createdAt asc'} initialEntityCount={1}>
		<Field field={'createdAt'} />
	</HasMany>
</>)

const PageForm = Component<{ hasRevision?: boolean }>(({ hasRevision }) => {
	return <>
		<TextField field={'internalName'} label={'Internal name'} />
		<HasMany
			field={hasRevision ? 'revisions[id=$revision]' : 'revisions'}
			orderBy={'createdAt desc'}
			initialEntityCount={1}
			limit={1}
			onUpdate={() => {
				debugger
				console.log('edited')
			}}
			onInitialize={list => {
				const entity = Array.from(list())[0]
				if (entity.existsOnServer) {
					const copier = new EntityCopier([
						new ContentCopyHandler('ContentBlock', 'json', 'references'),
					])
					list().createNewEntity(newEntity => {
						copier.copy(entity, newEntity())
					})
				console.log('copied')
				}
			}}>
			<HidePersistedRevision>
				<RevisionForm />
			</HidePersistedRevision>
		</HasMany>
	</>
})

const PublishButton = ({ hasRevision }: {hasRevision: boolean}) => {
	const page = useEntity().id as string
	const revisions = useEntityList({
		field: hasRevision ? 'revisions[id=$revision]' : 'revisions',
		orderBy: 'createdAt desc',
		limit: 1,
	})
	const revision = Array.from(revisions)[0].id as string
	const [publishMutation] = useAuthedContentMutation<{ updatePage: { ok: boolean, errorMessage: string | null } }, { page: string, revision: string }>(
		`mutation($page: UUID!, $revision: UUID!) {
			updatePage(by: {id: $page}, data: {activeRevision: {connect: {id: $revision}}}) {
				ok
				errorMessage
			}
		}
	`)
	const redirect = useRedirect()
	const toast = useShowToast()
	return <Button distinction={'primary'} intent={'success'} onClick={async () => {
		const result = await publishMutation({ page, revision })
		if (result.updatePage.ok) {
			toast({ message: 'Revision published', type: 'success', dismiss: true })
			redirect('page/edit(id: $request.id, revision: $revision)', { revision })
		} else {
			toast({ message: 'Failed to publish a revision', type: 'error', dismiss: true })
			console.error(result.updatePage)
		}
	}}>
		Publish
	</Button>
}

export const Edit = () => {
	const request = useCurrentRequest()

	const hasRevision = !!request?.parameters.revision
	return (
		<EditPage
			entity={'Page(id=$id)'}
			redirectOnSuccess={'page/edit(id: $request.id)'}
			rendererProps={{
				side: <RevisionList />,
				actions: <>
					<PersistButton labelSave={'Save as draft'} size={'default'} distinction="default" />
					<PublishButton hasRevision={hasRevision}/>
				</>,
			}}
		>
			<PageForm hasRevision={hasRevision} />
		</EditPage>
	)
}

export const Create = () => (
	<CreatePage
		entity={'Page'}
		redirectOnSuccess={'page/edit(id: $entity.id)'}
		rendererProps={{
			actions: <>
				<PersistButton labelSave={'Save as draft'} />
			</>,
		}}>
		<PageForm />
	</CreatePage>
)
