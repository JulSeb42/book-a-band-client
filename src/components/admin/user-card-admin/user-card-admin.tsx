import { useState } from "react"
import { BiDotsHorizontalRounded } from "react-icons/bi"
import { useQueryClient } from "@tanstack/react-query"
import {
	clsx,
	Image,
	getInitials,
	Dropdown,
	ButtonIcon,
	Text,
	Modal,
	Alert,
	Button,
	Flexbox,
	toast,
} from "@julseb-lib/react"
import { useAuth } from "context"
import { adminService } from "api"
import type { LibDropdownItem } from "@julseb-lib/react/types"
import type { IUserCardAdmin } from "./types"

export const UserCardAdmin: FC<IUserCardAdmin> = ({ user }) => {
	const { user: admin } = useAuth()
	const queryClient = useQueryClient()

	const [isOpen, setIsOpen] = useState(false)
	const [isResetOpen, setIsResetOpen] = useState(false)
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)

	const items: Array<LibDropdownItem> = [
		{
			content: "Reset password",
			onClick: () => setIsResetOpen(true),
			disabled: user._id === admin?._id,
		},
		{
			content: "Remove user",
			onClick: () => setIsDeleteOpen(true),
			disabled: user._id === admin?._id,
		},
	]

	const handleReset = () => {
		adminService
			.resetPassword(user._id)
			.then(res => toast.success(res.data.message))
			.catch(err => {
				toast.error("An error occurred, check console")
				console.error(err)
			})
			.finally(() => setIsResetOpen(false))
	}

	const handleDelete = () => {
		adminService
			.deleteUser(user._id)
			.then(res => {
				toast.success(res.data.message)
				queryClient.invalidateQueries({ queryKey: ["users"] })
			})
			.catch(err => {
				toast.error("An error occurred, check console")
				console.error(err)
			})
			.finally(() => setIsDeleteOpen(false))
	}

	return (
		<>
			<div
				className={clsx(
					"relative rounded-xl w-full aspect-square",
					isOpen && "z-50",
					"user-card-admin",
				)}
			>
				<div className="top-0 left-0 z-0 absolute flex justify-center items-center bg-primary-500 rounded-xl size-full font-black text-white text-2xl">
					{user.avatar ? (
						<Image
							src={user.avatar}
							alt={`Avatar ${user.fullName}`}
							borderRadius="xl"
							className="size-full"
							fit="cover"
						/>
					) : (
						<span>{getInitials(user.fullName)}</span>
					)}
				</div>

				<span
					className="block top-0 left-0 z-10 absolute rounded-xl size-full"
					style={{
						background: "var(--color-overlay-gradient-black)",
					}}
				/>

				<div className="top-1 right-1 z-30 absolute">
					<ButtonIcon
						icon={<BiDotsHorizontalRounded />}
						onClick={() => setIsOpen(!isOpen)}
						className="size-6"
						color="white"
					/>
					<Dropdown
						items={items}
						isOpen={isOpen}
						setIsOpen={setIsOpen}
						className="right-0 left-[unset] shadow-md w-[140px] -translate-y-2"
					/>
				</div>

				<div className="z-20 relative flex flex-col justify-end items-start p-2 size-full">
					<Text color="white">{user.fullName}</Text>
					{user.role === "admin" && (
						<Text tag="small" color="gray-300">
							Admin
						</Text>
					)}
				</div>
			</div>

			<Modal isOpen={isResetOpen} setIsOpen={setIsResetOpen}>
				<Alert color="danger">
					<Text>
						Are you sure you want to reset {user.fullName}'s
						password?
					</Text>

					<Flexbox gap="md">
						<Button color="danger" onClick={handleReset}>
							Yes, reset their password
						</Button>
						<Button
							color="danger"
							variant="transparent"
							onClick={() => setIsResetOpen(false)}
						>
							No, cancel
						</Button>
					</Flexbox>
				</Alert>
			</Modal>

			<Modal isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen}>
				<Alert color="danger">
					<Text>
						Are you sure you want to delete {user.fullName}'s
						account?
					</Text>

					<Flexbox gap="md">
						<Button color="danger" onClick={handleDelete}>
							Yes, delete their account
						</Button>
						<Button
							color="danger"
							variant="transparent"
							onClick={() => setIsDeleteOpen(false)}
						>
							No, cancel
						</Button>
					</Flexbox>
				</Alert>
			</Modal>
		</>
	)
}
