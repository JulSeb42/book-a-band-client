import { useEffect, useState, useRef } from "react"
import { io } from "socket.io-client"
import { BiSend } from "react-icons/bi"
import {
	Hr,
	ButtonIcon,
	clsx,
	getToday,
	getTimeNow,
	deleteDuplicates,
} from "@julseb-lib/react"
import { useAuth } from "context"
import { conversationService } from "api"
import { ErrorMessage } from "components/error-message"
import { Message } from "./message"
import { MessageSkeleton } from "./message-skeleton"
import type { Message as MessageType } from "types"
import type { IChat } from "./types"

const socket = io(import.meta.env.VITE_API_URL)

export const Chat: FC<IChat> = ({ conversation, isLoading, errorMessage }) => {
	const { user } = useAuth()

	const [messages, setMessages] = useState<Array<MessageType>>(
		conversation.messages,
	)
	const [input, setInput] = useState("")
	const [isFormLoading, setIsFormLoading] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const endRef = useRef<HTMLSpanElement>(null)

	useEffect(() => {
		socket.on("chat message", (msg: MessageType) => {
			setMessages(prev =>
				prev.some(m => m._id === msg._id) ? prev : [...prev, msg],
			)
		})

		return () => {
			socket.off("chat message")
		}
	}, [])

	useEffect(() => {
		if (endRef.current) {
			endRef.current.scrollTop = endRef.current.scrollHeight
		}
	}, [])

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight
		}
	}, [messages])

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		setIsFormLoading(true)

		if (!input.trim()) {
			setIsFormLoading(false)
			return
		}

		conversationService
			.unreadConversation(conversation._id, {
				currentUser: user?._id!,
				conversation: conversation,
			})
			.then(() => {
				setTimeout(() => {
					socket.emit("chat message", {
						body: input,
						sender: user,
						conversationId: conversation._id,
						date: getToday(),
						time: getTimeNow(),
					})
					setMessages([...messages])

					setIsFormLoading(false)
				}, 200)

				setInput("")
			})
	}

	if (errorMessage) return <ErrorMessage>{errorMessage}</ErrorMessage>

	return (
		<div
			className={clsx(
				"flex flex-col gap-1 border border-gray-200 rounded-lg w-full h-[60vh]",
				"chat",
			)}
		>
			<div
				ref={containerRef}
				className="flex flex-col gap-2 p-4 h-[60vh] overflow-y-auto"
			>
				{isLoading ? (
					<>
						<MessageSkeleton type="sender" />
						<MessageSkeleton type="receiver" />
						<MessageSkeleton type="sender" />
					</>
				) : (
					<>
						{deleteDuplicates(messages).map(msg => (
							<Message message={msg} key={msg._id} />
						))}
						<span ref={endRef} />{" "}
					</>
				)}
			</div>

			<Hr className="block mx-auto w-full max-w-[95%] h-0.5" isRounded />

			<form onSubmit={handleSubmit} className="flex gap-1 p-2">
				<textarea
					value={input}
					onChange={e => setInput(e.target.value)}
					placeholder="Type your message..."
					className="focus:bg-primary-50 px-2 py-1 outline-none w-full field-sizing-content resize-none"
					onKeyDown={e => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault()
							handleSubmit(e as any)
						}
					}}
				/>

				<ButtonIcon
					icon={<BiSend size={24} />}
					type="submit"
					disabled={!input.trim()}
					isLoading={isFormLoading}
					variant="transparent"
					className="size-8"
				/>
			</form>
		</div>
	)
}
