import { BiEuro, BiMap, BiMusic } from "react-icons/bi"
import { Flexbox, Text, convertPrice } from "@julseb-lib/react"
import type { User } from "types"

export const UserInfo: FC<IUserInfo> = ({ artist }) => {
	const infos: Array<{ title: string; content: string; icon: ReactElement }> =
		[
			{ title: "Location", content: artist?.city ?? "", icon: <BiMap /> },
			{
				title: "Price",
				content: convertPrice(artist?.price ?? 0).replaceAll(",00", ""),
				icon: <BiEuro />,
			},
			{ title: "Genre", content: artist?.genre ?? "", icon: <BiMusic /> },
		]

	return (
		<Flexbox flexDirection="col" gap="xs">
			{infos.map((info, i) => (
				<Text key={i} className="inline-flex items-center gap-1">
					<Text
						tag="strong"
						className="inline-flex items-center gap-0.5"
					>
						{info.icon} {info.title}:
					</Text>{" "}
					{info.content}
				</Text>
			))}
		</Flexbox>
	)
}

interface IUserInfo {
	artist: User
}
