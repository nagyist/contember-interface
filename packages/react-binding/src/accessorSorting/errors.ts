import { EntityListAccessor } from '@contember/binding'
import { BindingError } from '@contember/binding'
import type { FieldName } from '@contember/binding'
import type { SortedEntities } from './SortedEntities'

export const throwNoopError = (callbackName: keyof SortedEntities) => {
	throw new BindingError(
		`Cannot invoke '${callbackName}' in non-sortable mode. The 'sortByField' parameter of the 'useSortedEntities' ` +
			`hook is undefined.`,
	)
}

export const throwNonWritableError = (target: FieldName | EntityListAccessor) => {
	if (target instanceof EntityListAccessor) {
		throw new BindingError(`Trying to add a new entity to a list that is not writable.`)
	}
	throw new BindingError(`Trying to interactively sort by the '${target}' field but it is not writable.`)
}
