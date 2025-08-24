import { BiChevronRight } from "react-icons/bi"
import { convertDateShort, Flexbox, Text } from "@julseb-lib/react"
import type { User } from "types"

export const NextAvailabilities: FC<INextAvailabilities> = ({ artist }) => {
	if (!artist.available.length)
		return (
			<Text>
				{artist.fullName} does not have any availability, but you can
				still contact them!
			</Text>
		)

	return (
		<>
			<Text tag="h3">Next availabilities</Text>

			<Flexbox flexDirection="col" gap="2xs">
				{artist.available.map(date => (
					<Text key={date} className="inline-flex items-center">
						<BiChevronRight />
						{convertDateShort(date)}
					</Text>
				))}
			</Flexbox>
		</>
	)
}

interface INextAvailabilities {
	artist: User
}
