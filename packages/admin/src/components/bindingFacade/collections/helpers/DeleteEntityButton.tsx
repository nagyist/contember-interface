import { EntityAccessor, useEntity, useMutationState } from '@contember/react-binding'
import { Button, ButtonOwnProps, ButtonProps, Icon, toThemeClass } from '@contember/ui'
import classNames from 'classnames'
import { memo, ReactNode, useCallback } from 'react'
import { usePersistWithFeedback } from '../../../ui'

export type DeleteEntityButtonProps = ButtonProps & {
	immediatePersist?: true
	children?: ReactNode
}

export const DeleteEntityButton = memo((props: DeleteEntityButtonProps) => {
	const { children, immediatePersist, className, ...rest } = props
	const parentEntity = useEntity()
	const triggerPersist = usePersistWithFeedback()
	const isMutating = useMutationState()
	const onClick = useCallback(() => {
		if (props.immediatePersist && !confirm('Really?')) {
			return
		}
		parentEntity.deleteEntity()

		if (props.immediatePersist && triggerPersist) {
			triggerPersist().catch(() => {})
		}
	}, [triggerPersist, props.immediatePersist, parentEntity])

	if (!(parentEntity instanceof EntityAccessor)) {
		return null
	}

	let defaultProps: ButtonOwnProps = {
		size: 'small',
		flow: 'circular',
		distinction: 'seamless',
		bland: true,
	}

	return (
		<Button
			distinction="primary"
			{...defaultProps}
			{...rest}
			className={classNames(
				className,
				toThemeClass(null, 'danger', ':hover'),
			)}
			disabled={isMutating || rest.disabled}
			onClick={onClick}
		>
			{children || <Icon blueprintIcon="trash" />}
		</Button>
	)
})
DeleteEntityButton.displayName = 'DeleteEntityButton'
