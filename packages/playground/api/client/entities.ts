import type { BoardTaskStatus } from './enums'
import type { GridArticleState } from './enums'

export type JSONPrimitive = string | number | boolean | null
export type JSONValue = JSONPrimitive | JSONObject | JSONArray
export type JSONObject = { readonly [K in string]?: JSONValue }
export type JSONArray = readonly JSONValue[]

export type BoardTag = {
	name: 'BoardTag'
	unique:
		| { id: string }
		| { slug: string }
	columns: {
		id: string
		name: string
		slug: string
		color: string | null
	}
	hasOne: {
	}
	hasMany: {
	}
	hasManyBy: {
	}
}
export type BoardTask = {
	name: 'BoardTask'
	unique:
		| { id: string }
	columns: {
		id: string
		title: string
		description: string | null
		status: BoardTaskStatus | null
		order: number | null
	}
	hasOne: {
		assignee: BoardUser
	}
	hasMany: {
		tags: BoardTag
	}
	hasManyBy: {
	}
}
export type BoardUser = {
	name: 'BoardUser'
	unique:
		| { id: string }
		| { username: string }
	columns: {
		id: string
		name: string
		username: string
		order: number | null
	}
	hasOne: {
	}
	hasMany: {
	}
	hasManyBy: {
	}
}
export type GridArticle = {
	name: 'GridArticle'
	unique:
		| { id: string }
		| { slug: string }
	columns: {
		id: string
		title: string
		slug: string
		state: GridArticleState
		locked: boolean
		publishedAt: string | null
	}
	hasOne: {
		author: GridAuthor
		category: GridCategory
	}
	hasMany: {
		tags: GridTag
	}
	hasManyBy: {
	}
}
export type GridAuthor = {
	name: 'GridAuthor'
	unique:
		| { id: string }
		| { slug: string }
	columns: {
		id: string
		name: string
		slug: string
	}
	hasOne: {
	}
	hasMany: {
	}
	hasManyBy: {
	}
}
export type GridCategory = {
	name: 'GridCategory'
	unique:
		| { id: string }
		| { slug: string }
	columns: {
		id: string
		name: string
		slug: string
	}
	hasOne: {
	}
	hasMany: {
	}
	hasManyBy: {
	}
}
export type GridTag = {
	name: 'GridTag'
	unique:
		| { id: string }
		| { slug: string }
	columns: {
		id: string
		name: string
		slug: string
	}
	hasOne: {
	}
	hasMany: {
	}
	hasManyBy: {
	}
}
export type RepeaterItem = {
	name: 'RepeaterItem'
	unique:
		| { id: string }
	columns: {
		id: string
		title: string
		order: number | null
	}
	hasOne: {
	}
	hasMany: {
	}
	hasManyBy: {
	}
}

export type ContemberClientEntities = {
	BoardTag: BoardTag
	BoardTask: BoardTask
	BoardUser: BoardUser
	GridArticle: GridArticle
	GridAuthor: GridAuthor
	GridCategory: GridCategory
	GridTag: GridTag
	RepeaterItem: RepeaterItem
}

export type ContemberClientSchema = {
	entities: ContemberClientEntities
}
