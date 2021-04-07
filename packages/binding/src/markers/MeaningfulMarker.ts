import { EntityListSubTreeMarker } from './EntityListSubTreeMarker'
import { EntitySubTreeMarker } from './EntitySubTreeMarker'
import { FieldMarker } from './FieldMarker'
import { HasManyRelationMarker } from './HasManyRelationMarker'
import { HasOneRelationMarker } from './HasOneRelationMarker'

export type MeaningfulMarker =
	| FieldMarker
	| HasOneRelationMarker
	| HasManyRelationMarker
	| EntityListSubTreeMarker
	| EntitySubTreeMarker