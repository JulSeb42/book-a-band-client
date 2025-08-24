import { useState } from "react"
import { BiTrash } from "react-icons/bi"
import {
	ButtonIcon,
	Modal,
	Alert,
	Button,
	Text,
	Flexbox,
	toast,
} from "@julseb-lib/react"
import { conversationService } from "api"
import type { Conversation, User } from "types"

export const DeleteConversation: FC<IDeleteConversation> = ({
	user,
	conversationId,
	setConversations,
}) => {
	const [isOpen, setIsOpen] = useState(false)

	const handleDelete = () => {
		conversationService
			.deleteConversation(conversationId)
			.then(res => {
				toast.success(res.data.message)
				setConversations(prev =>
					prev.filter(c => c._id !== conversationId),
				)
			})
			.catch(err => {
				toast.error("An error occurred, check console")
				console.error(err)
			})
			.finally(() => setIsOpen(false))
	}

	return (
		<>
			<ButtonIcon
				className="top-2 right-2 absolute size-6"
				icon={<BiTrash size={16} />}
				color="danger"
				variant="ghost"
				onClick={() => setIsOpen(true)}
			/>

			<Modal isOpen={isOpen} setIsOpen={setIsOpen} hideCloseButton>
				<Alert color="danger" className="max-w-[600px]">
					<Text>
						Are you sure you want to delete your conversation with{" "}
						{user.fullName}?
					</Text>

					<Flexbox gap="sm">
						<Button color="danger" onClick={handleDelete}>
							Yes, delete it
						</Button>
						<Button
							color="danger"
							variant="transparent"
							onClick={() => setIsOpen(false)}
						>
							No, cancel
						</Button>
					</Flexbox>
				</Alert>
			</Modal>
		</>
	)
}

interface IDeleteConversation {
	user: User
	conversationId: string
	setConversations: DispatchState<Array<Conversation>>
}
