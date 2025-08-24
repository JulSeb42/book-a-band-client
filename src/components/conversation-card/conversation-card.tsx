import { Link } from "@tanstack/react-router"
import {
	Image,
	Text,
	Flexbox,
	Badge,
	clsx,
	convertDateShort,
	getYesterday,
	formatDate,
	getInitials,
} from "@julseb-lib/react"
import { useAuth } from "context"
import { DeleteConversation } from "./delete-conversation"
import type { IConversationCard } from "./types"

export const ConversationCard: FC<IConversationCard> = ({
	conversation,
	setConversations,
}) => {
	const { user } = useAuth()

	const otherUser =
		conversation.user1._id === user?._id
			? conversation.user2
			: conversation.user1

	const lastMessage = conversation.messages[conversation.messages.length - 1]

	const date =
		formatDate(new Date(lastMessage.date)) === formatDate(new Date())
			? "Today"
			: formatDate(new Date(lastMessage.date)) ===
				  formatDate(getYesterday())
				? "Yesterday"
				: convertDateShort(new Date(lastMessage.date))

	const hasBadge =
		(user?._id === conversation.user1._id && !conversation.readUser1) ||
		(user?._id === conversation.user2._id && !conversation.readUser2)

	return (
		<div className="relative">
			<Link
				to="/conversation/$id"
				params={{ id: conversation._id }}
				className={clsx(
					"z-0 relative flex items-start gap-2 hover:bg-gray-100 p-2 rounded-md",
					"conversation-card",
				)}
			>
				{otherUser?.avatar ? (
					<Image
						src={otherUser.avatar}
						alt={`Avatar ${otherUser.fullName}`}
						className="rounded-full size-12"
						fit="cover"
					/>
				) : (
					<div className="inline-flex justify-center items-center bg-primary-500 rounded-full size-12 text-white">
						{getInitials(otherUser.fullName)}
					</div>
				)}

				<Flexbox
					flexDirection="col"
					className="w-[calc(100%-48px-8px)]"
				>
					<Text tag="h6" color="primary-500">
						{otherUser.fullName}
						{hasBadge ? (
							<Badge
								color="danger"
								className="inline-block min-w-2 size-2 -translate-y-0.5 translate-x-2"
							/>
						) : null}
					</Text>
					<Text className="text-ellipsis line-clamp-1">
						{lastMessage.body}
					</Text>
					<Text tag="small" color="gray" className="italic">
						{date} at {lastMessage.time}
					</Text>
				</Flexbox>
			</Link>

			<DeleteConversation
				user={otherUser}
				conversationId={conversation._id}
				setConversations={setConversations}
			/>
		</div>
	)
}
