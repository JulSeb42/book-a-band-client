import { useState } from "react"
import { Link } from "@tanstack/react-router"
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

	const [currentUser, setCurrentUser] = useState(user)
	const [isOpen, setIsOpen] = useState(false)
	const [isRoleOpen, setIsRoleOpen] = useState(false)
	const [isResetOpen, setIsResetOpen] = useState(false)
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)

	const items: Array<LibDropdownItem> = [
		{
			content: "Visit profile",
			element: Link,
			// @ts-ignore
			to: `/users/${currentUser._id}`,
		},
		{
			content: `Set as ${currentUser?.role === "admin" ? "user" : "admin"}`,
			onClick: () => setIsRoleOpen(true),
			disabled: currentUser?._id === admin?._id,
		},
		{
			content: "Reset password",
			onClick: () => setIsResetOpen(true),
			disabled: currentUser._id === admin?._id,
		},
		{
			content: "Remove user",
			onClick: () => setIsDeleteOpen(true),
			disabled: currentUser._id === admin?._id,
		},
	]

	const handleRole = () => {
		const newRole = user.role === "admin" ? "user" : "admin"
		adminService
			.editUserRole(user._id, { role: newRole })
			.then(res => {
				setCurrentUser(res.data)
				toast.success(`${currentUser.fullName} is now ${newRole}`)
				setIsOpen(false)
				setIsRoleOpen(false)
			})
			.catch(err => {
				console.error(err)
				toast.error("An error occurred, check console")
			})
	}

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
					{currentUser.avatar ? (
						<Image
							src={currentUser.avatar}
							alt={`Avatar ${currentUser.fullName}`}
							borderRadius="xl"
						/>
					) : (
						<span>{getInitials(currentUser.fullName)}</span>
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
					<Text color="white">{currentUser.fullName}</Text>
					{currentUser.role === "admin" && (
						<Text tag="small" color="gray-300">
							Admin
						</Text>
					)}
				</div>
			</div>

			<Modal isOpen={isResetOpen} setIsOpen={setIsResetOpen}>
				<Alert color="danger">
					<Text>
						Are you sure you want to reset {currentUser.fullName}'s
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
						Are you sure you want to delete {currentUser.fullName}'s
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

			<Modal isOpen={isRoleOpen} setIsOpen={setIsRoleOpen}>
				<Alert color="danger">
					<Text>
						Are you sure you want to set {currentUser.fullName} as{" "}
						{currentUser.role === "admin" ? "a user" : "an admin"}?
					</Text>

					<Flexbox gap="md">
						<Button color="danger" onClick={handleRole}>
							Yes, change their role
						</Button>
						<Button
							color="danger"
							variant="transparent"
							onClick={() => setIsRoleOpen(false)}
						>
							No, cancel
						</Button>
					</Flexbox>
				</Alert>
			</Modal>
		</>
	)
}
