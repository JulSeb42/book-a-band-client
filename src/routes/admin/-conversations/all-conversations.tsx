import { Fragment } from "react"
import { useQuery } from "@tanstack/react-query"
import { Hr, Text, generateNumbers, usePaginatedData } from "@julseb-lib/react"
import {
	ConversationCard,
	ConversationCardSkeleton,
	ErrorMessage,
	Pagination,
} from "components"
import { conversationService } from "api"
import { useAuth } from "context"

const GENERATED = generateNumbers(0, 10)

export const AllConversations: FC<IAllConversations> = ({ page }) => {
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

	if (isPending)
		return GENERATED.map(n => (
			<Fragment key={n}>
				<ConversationCardSkeleton />
				{n !== GENERATED.length - 1 && <Hr />}
			</Fragment>
		))

	if (isError) return <ErrorMessage>{error.message}</ErrorMessage>

	if (!conversations.length)
		return <Text>You don't have any conversation yet.</Text>

	const { paginatedData, totalPages } = usePaginatedData(conversations, page)

	return (
		<>
			{paginatedData.map((conversation, i) => (
				<Fragment key={conversation._id}>
					<ConversationCard
						conversation={conversation}
						refetch={refetch}
					/>

					{i !== paginatedData.length - 1 && <Hr />}
				</Fragment>
			))}

			<Pagination totalPages={totalPages} currentPage={page} />
		</>
	)
}

interface IAllConversations {
	page: number
}
