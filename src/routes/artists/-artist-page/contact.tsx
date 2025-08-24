import { useState, useEffect } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { Text, SkeletonCard, Skeleton, Form, Input } from "@julseb-lib/react"
import { ErrorMessage } from "components"
import { conversationService } from "api"
import { useAuth } from "context"
import { COMMON_TEXTS } from "data"
import type { LibValidationStatus } from "@julseb-lib/react/types"
import type { Conversation, IErrorMessage, User } from "types"

export const ContactArtist: FC<IContactArtist> = ({ artist }) => {
	const navigate = useNavigate()

	const { user, isLoggedIn } = useAuth()

	const [existingConversation, setExistingConversation] = useState<
		Conversation | undefined
	>(undefined)
	const [isLoading, setIsLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState<IErrorMessage>(undefined)

	const [message, setMessage] = useState(
		"Hello, I'm organising a party on the 17th of September 2025, do you have availabilities?",
	)
	const [validation, setValidation] = useState<LibValidationStatus>(undefined)

	useEffect(() => {
		if (user && isLoggedIn && isLoading) {
			conversationService
				.getUserConversations(user._id)
				.then(res => {
					const conversations = res.data

					setExistingConversation(
						conversations.find(
							c =>
								(c.user1._id === user?._id &&
									c.user2._id === artist._id) ||
								(c.user2._id === user?._id &&
									c.user1._id === artist._id),
						),
					)
				})
				.catch(err => setErrorMessage(err.response.data.message))
				.finally(() => setIsLoading(false))
		} else {
			setIsLoading(false)
		}
	}, [user, isLoading, isLoggedIn])

	const handleMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
		e.preventDefault()

		const { value } = e.target

		setMessage(value)

		if (validation !== undefined) {
			if (value) setValidation(true)
			else setValidation(false)
		}
	}

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		if (!message.length) {
			setValidation(false)
			return
		}

		if (!user!._id || !artist._id) {
			alert("User or Artist's ID is missing")
			return
		}

		const newConversation = {
			user1: user!._id,
			user2: artist._id,
			body: message,
		}

		conversationService.newConversation(newConversation).then(res => {
			setTimeout(
				() =>
					navigate({
						to: "/conversation/$id",
						params: { id: res.data._id },
					}),
				200,
			)
		})
	}

	if (isLoading)
		return (
			<SkeletonCard className="w-full h-[80px]" isShiny>
				<Skeleton className="size-full" />
			</SkeletonCard>
		)

	if (errorMessage) return <ErrorMessage>{errorMessage}</ErrorMessage>

	if (!isLoggedIn || !user)
		return (
			<Text>You need to be logged in to contact {artist.fullName}.</Text>
		)

	if (existingConversation)
		return (
			<Text>
				You already have a conversation with {artist.fullName}.{" "}
				<Link
					to="/conversation/$id"
					params={{ id: existingConversation._id }}
				>
					Go to the conversation.
				</Link>
			</Text>
		)

	return (
		<Form
			buttonPrimary="Send"
			buttonSecondary={{
				content: "Cancel",
				onClick: () => setMessage(""),
			}}
			onSubmit={handleSubmit}
		>
			<Input
				id="message"
				type="textarea"
				value={message}
				onChange={handleMessage}
				validation={{
					status: validation,
					message: COMMON_TEXTS.ERRORS.MESSAGE_EMPTY,
				}}
				onKeyDown={e => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault()
						handleSubmit(e as any)
					}
				}}
			/>
		</Form>
	)
}

interface IContactArtist {
	artist: User
}
