import { Linkify, clsx } from "@julseb-lib/react"
import { useAuth } from "context"
import type { Message as MessageType } from "types"

export const Message: FC<IMessage> = ({ message }) => {
	const { user } = useAuth()

	const isSender = message.sender._id === (user?._id as any)

	return (
		<div
			className={clsx(
				"flex",
				!isSender ? "justify-start" : "justify-end",
			)}
		>
			<Linkify
				className={clsx(
					"p-2 rounded-md w-fit max-w-[70%]",
					!isSender ? "bg-gray-200" : "bg-primary-500 text-white",
				)}
			>
				{message.body}
			</Linkify>
		</div>
	)
}

interface IMessage {
	message: MessageType
}
