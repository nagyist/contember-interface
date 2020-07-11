import * as React from 'react'
import { EntityAccessor } from '../accessors'
import { useAccessorUpdateSubscription } from './useAccessorUpdateSubscription'
import { useEntityKey } from './useEntityKey'
import { useGetEntityByKey } from './useGetEntityByKey'

export const useParentEntityAccessor = (): EntityAccessor => {
	const entityKey = useEntityKey()
	const getEntityByKey = useGetEntityByKey()

	const getEntityAccessor = React.useCallback(() => getEntityByKey(entityKey), [entityKey, getEntityByKey])
	return useAccessorUpdateSubscription(getEntityAccessor)
}