import { useState, useEffect, Fragment } from "react"
import { Section, Text, Hr, slugify } from "@julseb-lib/react"
import {
	ConversationCard,
	ConversationCardSkeleton,
	ErrorMessage,
} from "components"
import { conversationService } from "api"
import { useAuth } from "context"
import type { Conversation, IErrorMessage } from "types"
import type { ReadFilter } from ".."

export const UserConversations: FC<IUserConversations> = ({
	search,
	filter,
}) => {
	const { user } = useAuth()

	const [userConversations, setUserConversations] = useState<
		Array<Conversation>
	>([])
	const [isLoading, setIsLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState<IErrorMessage>(undefined)

	useEffect(() => {
		if (isLoading) {
			conversationService
				.getUserConversations(user?._id!)
				.then(res => setUserConversations(res.data))
				.catch(err => setErrorMessage(err.response.data.message))
				.finally(() => setIsLoading(false))
		}
	}, [isLoading])

	let filteredConversations = userConversations

	if (search) {
		filteredConversations = filteredConversations.filter(c => {
			if (user?._id === c.user1._id) {
				return slugify(c.user2.fullName).includes(slugify(search))
			} else {
				return slugify(c.user1.fullName).includes(slugify(search))
			}
		})
	}

	if (filter !== "All") {
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

	if (isLoading)
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

	if (errorMessage) return <ErrorMessage>{errorMessage}</ErrorMessage>

	return (
		<Section>
			<Text tag="h3">Conversations</Text>

			{userConversations && userConversations.length ? (
				filteredConversations.length ? (
					filteredConversations.map((conversation, i) => {
						return (
							<Fragment key={conversation._id}>
								<ConversationCard
									conversation={conversation}
									setConversations={setUserConversations}
								/>

								{i !== userConversations.length - 1 && <Hr />}
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
