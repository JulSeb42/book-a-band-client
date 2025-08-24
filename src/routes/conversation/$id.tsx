import { useEffect, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Text, toast } from "@julseb-lib/react"
import { Page, Chat } from "components"
import { useAuth } from "context"
import { conversationService } from "api"
import type { Conversation, IErrorMessage } from "types"

const Conversation: FC = () => {
	const { id } = Route.useParams()

	const { user } = useAuth()

	const [conversation, setConversation] = useState<Conversation>()
	const [isLoading, setIsLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState<IErrorMessage>(undefined)

	useEffect(() => {
		if (isLoading) {
			conversationService
				.getConversation(id)
				.then(res => setConversation(res.data))
				.catch(err => setErrorMessage(err.response.data.message))
				.finally(() => setIsLoading(false))
		}
	}, [isLoading])

	useEffect(() => {
		if (
			user?._id === conversation?.user1._id &&
			conversation?.readUser1 === false
		) {
			conversationService
				.readConversation(conversation._id, {
					readUser1: true,
				})
				.then(res => setConversation(res.data))
				.catch(err => {
					toast.error(
						"An error occurred while reading the conversation, check console",
					)
					console.error(err)
				})
		}

		if (
			user?._id === conversation?.user2._id &&
			conversation?.readUser2 === false
		) {
			conversationService
				.readConversation(conversation._id, {
					readUser2: true,
				})
				.then(res => setConversation(res.data))
				.catch(err => {
					toast.error(
						"An error occurred while reading the conversation, check console",
					)
					console.error(err)
				})
		}
	}, [user?._id, conversation?.user1?._id, conversation?.user2?._id])

	const otherUser =
		conversation?.user1._id === user?._id
			? conversation?.user2
			: conversation?.user1

	return (
		<Page title="Conversation" type="protected">
			{conversation ? (
				<>
					<Text tag="h1">
						Conversation with {otherUser?.fullName}
					</Text>

					<Chat
						conversation={conversation!}
						isLoading={isLoading}
						errorMessage={errorMessage}
					/>
				</>
			) : (
				<>
					<Text tag="h1">Error</Text>
					<Text>No conversation has been found.</Text>
				</>
			)}
		</Page>
	)
}

export const Route = createFileRoute("/conversation/$id")({
	component: Conversation,
})
