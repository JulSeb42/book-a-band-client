import { Fragment, useEffect } from "react"
import { io } from "socket.io-client"
import { useQuery } from "@tanstack/react-query"
import { Section, Text, Hr, slugify } from "@julseb-lib/react"
import {
	ConversationCard,
	ConversationCardSkeleton,
	ErrorMessage,
} from "components"
import { useAuth } from "context"
import type { ReadFilter } from ".."
import { conversationService } from "api"

const socket = io(import.meta.env.VITE_API_URL)

export const UserConversations: FC<IUserConversations> = ({
	search,
	filter,
}) => {
	const { user } = useAuth()

	const {
		data: conversations,
		isError,
		error,
		isPending,
		refetch,
	} = useQuery({
		queryKey: ["conversations"],
		queryFn: () =>
			conversationService
				.getUserConversations(user!._id)
				.then(res => res.data),
	})

	let filteredConversations = conversations

	if (search && filteredConversations?.length) {
		filteredConversations = filteredConversations.filter(c => {
			if (user?._id === c.user1._id) {
				return slugify(c.user2.fullName).includes(slugify(search))
			} else {
				return slugify(c.user1.fullName).includes(slugify(search))
			}
		})
	}

	if (filter !== "All" && filteredConversations?.length) {
		filteredConversations = filteredConversations.filter(c => {
			if (filter === "Unread") {
				if (user?._id === c.user1._id) {
					return c.readUser1 === false
				} else {
					return c.readUser2 === false
				}
			} else if (filter === "Read") {
				if (user?._id === c.user1._id) {
					return c.readUser1 === true
				} else {
					return c.readUser2 === true
				}
			}
		})
	}

	useEffect(() => {
		socket.on("chat message", () => {
			refetch()
		})
		return () => {
			socket.off("chat message")
		}
	}, [refetch])

	if (isPending)
		return (
			<>
				<ConversationCardSkeleton />
				<Hr />
				<ConversationCardSkeleton />
				<Hr />
				<ConversationCardSkeleton />
				<Hr />
				<ConversationCardSkeleton />
				<Hr />
				<ConversationCardSkeleton />
				<Hr />
			</>
		)

	if (isError) return <ErrorMessage>{error.message}</ErrorMessage>

	return (
		<Section>
			<Text tag="h3">Conversations</Text>

			{conversations && conversations.length ? (
				filteredConversations?.length ? (
					filteredConversations.map((conversation, i) => {
						return (
							<Fragment key={conversation._id}>
								<ConversationCard
									conversation={conversation}
									refetch={refetch}
								/>

								{i !== filteredConversations.length - 1 && (
									<Hr />
								)}
							</Fragment>
						)
					})
				) : (
					<Text>Your search did not return any result.</Text>
				)
			) : (
				<Text>No conversation yet.</Text>
			)}
		</Section>
	)
}

interface IUserConversations {
	search: string
	filter: ReadFilter
}
