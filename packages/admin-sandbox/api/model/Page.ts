import { SchemaDefinition as d } from '@contember/schema-definition'
import { Content } from './Content'
import { Tag } from './Article'

export class Page {
	internalName = d.stringColumn().notNull()
	activeRevision = d.oneHasOne(PageRevision)
	revisions = d.oneHasMany(PageRevision, 'page').orderBy('createdAt')
}

export class PageRevision {
	createdAt = d.dateTimeColumn().notNull().default('now')
	page = d.manyHasOne(Page, 'revisions').notNull().cascadeOnDelete()
	title = d.stringColumn()
	lead = d.stringColumn()
	footer = d.stringColumn()
	content = d.oneHasOne(Content).removeOrphan()
	tags = d.manyHasMany(Tag)
}
