import type { Conversation, IErrorMessage } from "types"

export interface IChat {
	conversation: Conversation
	isLoading: boolean
	errorMessage: IErrorMessage
	refetch: () => void
}
