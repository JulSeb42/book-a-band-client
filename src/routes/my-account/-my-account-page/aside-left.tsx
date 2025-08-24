import { Link } from "@tanstack/react-router"
import { Button, getInitials, Image } from "@julseb-lib/react"
import { useAuth } from "context"

export const UserAsideLeft: FC = () => {
	const { user } = useAuth()

	if (!user) return null

	return (
		<>
			{user.avatar ? (
				<Image
					src={user.avatar}
					alt={`Avatar ${user.fullName}`}
					className="rounded-full size-40"
				/>
			) : (
				<div className="flex justify-center items-center bg-primary-500 rounded-full size-40 font-black text-white text-4xl">
					{getInitials(user.fullName)}
				</div>
			)}

			<Button
				element={Link}
				className="self-center"
				// @ts-expect-error
				to="/my-account/edit-account"
			>
				Edit your account
			</Button>
		</>
	)
}
