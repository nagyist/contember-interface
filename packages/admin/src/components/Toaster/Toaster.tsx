import { Button, Icon, Intent, Message, MessageProps } from '@contember/ui'
import { useContext } from 'react'
import { ToasterContext } from './ToasterContext'

export type ToastType = 'success' | 'error' | 'warning' | 'info'
export type ToastId = string

export interface ToastDefinition {
	type: ToastType
	message: string
}

export interface Toast extends ToastDefinition {
	id: ToastId
}


const toastTypeToMessageType: { [K in ToastType]: MessageProps['type'] } = {
	success: 'success',
	warning: 'warn',
	error: 'danger',
	info: 'info',
}
const toastTypeToIntent: { [K in ToastType]: Intent } = {
	success: 'success',
	warning: 'warn',
	error: 'danger',
	info: 'primary',
}

export const Toaster: React.FC = () => {
	const toasterContext = useContext(ToasterContext)
	if (!toasterContext) {
		throw new Error('Toaster context is not initialized')
	}
	return (
		<div className="toaster">
			{toasterContext.toasts.map(toast => (
				<div key={toast.id} className="toaster-item">
					<Message
						type={toastTypeToMessageType[toast.type]}
						flow="block"
						lifted
						distinction="striking"
						action={
							<Button
								intent={toastTypeToIntent[toast.type]}
								distinction="seamless"
								flow="squarish"
								onClick={() => {
									toasterContext.dismissToast(toast.id)
								}}
							>
								<Icon blueprintIcon="cross" style={{ color: 'white' }} />
							</Button>
						}
					>
						{toast.message}
					</Message>
				</div>
			))}
		</div>
	)
}