import { useState, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Text, Skeleton, toast } from "@julseb-lib/react"
import { ErrorMessage } from "components"
import { useAuth } from "context"
import { userService, conversationService } from "api"
import type { Conversation, IErrorMessage, User } from "types"

export const NotApproved: FC = () => {
	const navigate = useNavigate()
	const { user, isLoading: loading } = useAuth()

	const [admins, setAdmins] = useState<Array<User>>([])
	const [existingConversation, setExistingConversation] = useState<
		Conversation | undefined
	>(undefined)
	const [isLoading, setIsLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState<IErrorMessage>(undefined)

	useEffect(() => {
		userService
			.allAdmins()
			.then(res => setAdmins(res.data))
			.catch(err => {
				console.error(err)
				setErrorMessage(
					"No admin has been found, please reload the page",
				)
			})
			.finally(() => setIsLoading(false))
	}, [])

	useEffect(() => {
		if (user && admins) {
			conversationService
				.getUserConversations(user._id)
				.then(res => {
					if (
						res.data.find(
							conversation =>
								(conversation.user1?._id === user?._id &&
									conversation.user2?._id ===
										admins?.[0]?._id) ||
								(conversation.user1?._id === admins?.[0]?._id &&
									conversation.user2?._id === user?._id),
						)
					) {
						setExistingConversation(
							res.data.find(
								conversation =>
									(conversation.user1._id === user._id &&
										conversation.user2._id ===
											admins[0]._id) ||
									(conversation.user1._id === admins[0]._id &&
										conversation.user2._id === user._id),
							),
						)
					}
				})
				.catch(err => {
					toast.error("An error occurred, try again later")
					console.error(err)
				})
		}
	}, [user, admins])

	const handleContact = () => {
		if (existingConversation) {
			navigate({
				to: "/conversation/$id",
				params: { id: existingConversation._id },
			})
		} else {
			conversationService
				.newConversation({
					user1: user!._id,
					user2: admins[0]._id,
					body: "",
				})
				.then(res =>
					setTimeout(
						() =>
							navigate({
								to: "/conversation/$id",
								params: { id: res.data._id },
							}),
						200,
					),
				)
				.catch(err => {
					toast.error("An error occurred, try again later")
					console.error(err)
				})
		}
	}

	if (isLoading || loading)
		return <Skeleton className="w-[70%] h-6" animation="shine" />

	if (user?.approved) return null

	return (
		<>
			<ErrorMessage>{errorMessage}</ErrorMessage>

			<Text>
				You are not approved yet, so you are not visible to other
				people. If you feel that it takes too long before approval,{" "}
				<button onClick={handleContact}>
					you can contact an admin by clicking here
				</button>
				.
			</Text>
		</>
	)
}
