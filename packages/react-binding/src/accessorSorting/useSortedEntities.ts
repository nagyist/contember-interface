import { useCallback, useMemo } from 'react'
import { useDesugaredRelativeSingleField } from '../accessorPropagation'
import type { EntityAccessor, EntityListAccessor } from '@contember/binding'
import type { SugaredFieldProps } from '../helperComponents'
import type { RelativeSingleField } from '@contember/binding'
import { SortedEntities } from './SortedEntities'
import { throwNoopError } from './errors'
import { addEntityAtIndex } from './addEntityAtIndex'
import { sortEntities } from './sortEntities'
import { moveEntity } from './moveEntity'

const addNewAtIndexImplementation = (
	callbackName: keyof SortedEntities,
	entityList: EntityListAccessor,
	desugaredSortableByField: RelativeSingleField | undefined,
	sortedEntitiesCount: number,
	index: number,
	preprocess?: EntityAccessor.BatchUpdatesHandler,
) => {
	if (!desugaredSortableByField) {
		if (index === sortedEntitiesCount) {
			return entityList.createNewEntity(preprocess)
		}
		return throwNoopError(callbackName)
	}
	addEntityAtIndex(entityList, desugaredSortableByField, index, preprocess)
}

export const useSortedEntities = (
	entityList: EntityListAccessor,
	sortableByField: SugaredFieldProps['field'] | undefined,
): SortedEntities => {
	const desugaredSortableByField = useDesugaredRelativeSingleField(sortableByField)
	const sortedEntities = useMemo(() => {
		return sortEntities(Array.from(entityList), desugaredSortableByField)
	}, [desugaredSortableByField, entityList])

	const addNewAtIndex = useCallback<SortedEntities['addNewAtIndex']>(
		(index: number, preprocess?: EntityAccessor.BatchUpdatesHandler) => {
			addNewAtIndexImplementation(
				'addNewAtIndex',
				entityList,
				desugaredSortableByField,
				sortedEntities.length,
				index,
				preprocess,
			)
		},
		[desugaredSortableByField, entityList, sortedEntities.length],
	)
	const prependNew = useCallback<SortedEntities['prependNew']>(
		preprocess => {
			addNewAtIndexImplementation(
				'prependNew',
				entityList,
				desugaredSortableByField,
				sortedEntities.length,
				0,
				preprocess,
			)
		},
		[desugaredSortableByField, entityList, sortedEntities.length],
	)
	const appendNew = useCallback<SortedEntities['appendNew']>(
		preprocess => {
			addNewAtIndexImplementation(
				'appendNew',
				entityList,
				desugaredSortableByField,
				sortedEntities.length,
				sortedEntities.length,
				preprocess,
			)
		},
		[desugaredSortableByField, entityList, sortedEntities.length],
	)
	const normalizedMoveEntity = useCallback<SortedEntities['moveEntity']>(
		(oldIndex, newIndex) => {
			if (!desugaredSortableByField) {
				return throwNoopError('moveEntity')
			}
			moveEntity(entityList, desugaredSortableByField, oldIndex, newIndex)
		},
		[desugaredSortableByField, entityList],
	)

	// This wasn't such a great idea…
	// useEffect(() => {
	// 	if (!desugaredSortableByField) {
	// 		return
	// 	}
	// 	repairEntitiesOrder(desugaredSortableByField, entityList, sortedEntities)
	// }, [desugaredSortableByField, entityList, sortedEntities])

	return useMemo<SortedEntities>(
		() => ({
			entities: sortedEntities,
			addNewAtIndex,
			appendNew,
			prependNew,
			moveEntity: normalizedMoveEntity,
		}),
		[sortedEntities, addNewAtIndex, appendNew, prependNew, normalizedMoveEntity],
	)
}
