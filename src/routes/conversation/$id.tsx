import { useEffect } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { Text, toast } from "@julseb-lib/react"
import { Page, Chat } from "components"
import { useAuth } from "context"
import { NotFoundPage } from "pages"
import { conversationService } from "api"
import type { Conversation } from "types"

const Conversation: FC = () => {
	const { id } = Route.useParams()

	const { user } = useAuth()

	const {
		data: conversation,
		isPending,
		error,
		refetch,
	} = useQuery({
		queryKey: ["conversation"],
		queryFn: () =>
			conversationService.getConversation(id).then(res => res.data),
	})

	useEffect(() => {
		if (
			user?._id === conversation?.user1._id &&
			conversation?.readUser1 === false
		) {
			conversationService
				.readConversation(conversation._id, {
					readUser1: true,
				})
				.then(() => refetch())
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
				.then(() => refetch())
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

	if (!conversation) return <NotFoundPage />

	return (
		<Page title="Conversation" type="protected">
			<Text tag="h1">Conversation with {otherUser?.fullName}</Text>

			<Chat
				conversation={conversation!}
				isLoading={isPending}
				errorMessage={error?.message}
				refetch={refetch}
			/>
		</Page>
	)
}

export const Route = createFileRoute("/conversation/$id")({
	component: Conversation,
})
