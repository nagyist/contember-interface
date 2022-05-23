import { ReactNode } from 'react'

export const TAB_INDEX_FOCUSABLE = 0
export const TAB_INDEX_TEMPORARY_UNFOCUSABLE = -1
export const TAB_INDEX_NEVER_FOCUSABLE = -2
export interface MenuProps {
  /**
   * Unique identifier to identify menu. Mandatory if you have multiple menus on a single page.
   *
   * Menus are being persisted in session storage.
   */
  id?: string
  showCaret?: boolean
  focusMenuItemLabel?: string
}

export interface MenuItemProps<T extends any = any> {
	children?: ReactNode
	title?: string | ReactNode
	to?: T
	href?: string
	external?: boolean
	expandedByDefault?: boolean
}
