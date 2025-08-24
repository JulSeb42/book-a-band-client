import type { LibMainSize } from "@julseb-lib/react/types"

export interface IAdminPage {
	title: string
	children?: Children
	isLoading?: boolean
	mainSize?: LibMainSize
}
