import { http } from "./http-common"
import { generateServerRoute } from "utils"
import type { SERVER_PATHS } from "./server-paths"
import type {
	ApiResponse,
	Conversation,
	NewConversationFormData,
	ReadConversationFormData,
	UnreadConversationFormData,
} from "types"

type PATHS = keyof typeof SERVER_PATHS.CONVERSATION

const generateRoute = (route: Exclude<PATHS, "ROOT">, id?: string) =>
	generateServerRoute("CONVERSATION", route, id)

class ConversationService {
	allConversations = async (): ApiResponse<Array<Conversation>> =>
		await http.get(generateRoute("ALL_CONVERSATIONS"))

	getConversation = async (id: string): ApiResponse<Conversation> =>
		await http.get(generateRoute("GET_CONVERSATION", id))

	getUserConversations = async (
		id: string,
	): ApiResponse<Array<Conversation>> =>
		await http.get(generateRoute("GET_USER_CONVERSATIONS", id))

	newConversation = async (
		data: NewConversationFormData,
	): ApiResponse<Conversation> =>
		await http.post(generateRoute("NEW_CONVERSATION"), data)

	readConversation = async (
		id: string,
		data: ReadConversationFormData,
	): ApiResponse<Conversation> =>
		await http.put(generateRoute("READ_CONVERSATION", id), data)

	unreadConversation = async (id: string, data: UnreadConversationFormData) =>
		await http.put(generateRoute("UNREAD_CONVERSATION", id), data)

	deleteConversation = async (id: string) =>
		await http.delete(generateRoute("DELETE_CONVERSATION", id))
}

export const conversationService = new ConversationService()
