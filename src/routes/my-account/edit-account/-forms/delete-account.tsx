import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Button, Modal, Alert, Text, Flexbox, toast } from "@julseb-lib/react"
import { ErrorMessage } from "components"
import { userService } from "api"
import { useAuth } from "context"
import type { IErrorMessage } from "types"

export const DeleteAccount: FC = () => {
	const navigate = useNavigate()
	const { user, logoutUser } = useAuth()

	const [isOpen, setIsOpen] = useState(false)
	const [errorMessage, setErrorMessage] = useState<IErrorMessage>(undefined)

	const handleClick = () => {
		userService
			.deleteAccount(user!._id)
			.then(() => {
				setIsOpen(false)
				logoutUser()
				toast.success("Your account has been deleted!")
			})
			.then(() => setTimeout(() => navigate({ to: "/goodbye" }), 300))
			.catch(err => {
				console.error(err)
				setErrorMessage(err.response.data.message)
			})
	}

	return (
		<>
			<Button color="danger" onClick={() => setIsOpen(true)}>
				Delete your account
			</Button>

			<ErrorMessage>{errorMessage}</ErrorMessage>

			<Modal isOpen={isOpen} setIsOpen={setIsOpen} hideCloseButton>
				<Alert color="danger" className="max-w-[600px]">
					<Text>Are you sure you want to delete your account?</Text>

					<Flexbox gap="xs">
						<Button color="danger" onClick={handleClick}>
							Yes, delete my account
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
