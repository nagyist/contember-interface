import { SchemaDefinition as d } from '@contember/schema-definition'

export class Locale {
	code = d.stringColumn().unique().notNull()
}