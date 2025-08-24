import { Image } from "@julseb-lib/react"
import type { User } from "types"

export const UserAvatar: FC<IUserAvatar> = ({ artist }) => {
	return (
		<>
			<Image
				src={artist.avatar}
				alt={artist.fullName}
				className="rounded-full size-40"
				fit="cover"
			/>
		</>
	)
}

interface IUserAvatar {
	artist: User
}
