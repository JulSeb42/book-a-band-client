import { clsx, Avatar, Text, Image, getInitials } from "@julseb-lib/react"
import type { IUserHeader } from "./types"

export const UserHeader: FC<IUserHeader> = ({ user, isPublic }) => {
	return (
		<div className={clsx("flex items-center gap-2", "user-header")}>
			<Avatar>
				{user?.avatar ? (
					<Image
						src={user?.avatar}
						alt={`Avatar ${user?.fullName}`}
					/>
				) : (
					getInitials(user?.fullName)
				)}
			</Avatar>

			<Text tag="h1">
				{!isPublic ? "Hello " : ""}
				{user?.fullName}
			</Text>
		</div>
	)
}
