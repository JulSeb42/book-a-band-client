import type { Conversation } from "types"

export interface IConversationCard {
	conversation: Conversation
	setConversations: DispatchState<Array<Conversation>>
}
