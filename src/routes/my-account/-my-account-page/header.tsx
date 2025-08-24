import { BiMap } from "react-icons/bi"
import { Section, Text } from "@julseb-lib/react"
import { useAuth } from "context"

export const UserHeader: FC = () => {
	const { user } = useAuth()

	return (
		<Section gap="xs">
			<Text tag="h1">Hello {user?.fullName}</Text>

			<Text className="inline-flex items-center gap-1">
				<BiMap />
				{user?.city}
			</Text>
		</Section>
	)
}
