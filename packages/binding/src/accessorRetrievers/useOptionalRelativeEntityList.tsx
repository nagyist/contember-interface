import * as React from 'react'
import { EntityListAccessor } from '../accessors'
import { SugaredRelativeEntityList } from '../treeParameters'
import { useEntityContext } from './useEntityContext'
import { useOptionalDesugaredRelativeEntityList } from './useOptionalDesugaredRelativeEntityList'

export const useOptionalRelativeEntityList = (
	sugaredRelativeEntityList: string | SugaredRelativeEntityList | undefined,
): EntityListAccessor | undefined => {
	const entity = useEntityContext()
	const relativeEntityList = useOptionalDesugaredRelativeEntityList(sugaredRelativeEntityList)
	return React.useMemo(() => (relativeEntityList ? entity.getRelativeEntityList(relativeEntityList) : undefined), [
		entity,
		relativeEntityList,
	])
}