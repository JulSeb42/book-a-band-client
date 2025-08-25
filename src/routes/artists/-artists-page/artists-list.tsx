import { Fragment } from "react"
import { Hr, Text, generateNumbers } from "@julseb-lib/react"
import { ArtistCard, ArtistCardSkeleton, ErrorMessage } from "components"
import { COMMON_TEXTS } from "data"
import type { User } from "types"

const GENERATED = generateNumbers(0, 10)

export const ArtistsList: FC<IArtistsList> = ({
	paginatedData,
	error,
	isLoading,
	isError,
}) => {
	if (isLoading)
		return GENERATED.map(n => (
			<Fragment key={n}>
				<ArtistCardSkeleton />
				{n !== GENERATED.length - 1 && <Hr />}
			</Fragment>
		))

	if (isError) return <ErrorMessage>{error}</ErrorMessage>

	if (!paginatedData.length)
		return <Text>{COMMON_TEXTS.SEARCH_NO_RESULT}</Text>

	return paginatedData.map((artist, i) => (
		<Fragment key={artist._id}>
			<ArtistCard artist={artist} />

			{i !== paginatedData.length - 1 && <Hr />}
		</Fragment>
	))
}

interface IArtistsList {
	paginatedData: Array<User>
	isError: boolean
	error: string | undefined
	isLoading: boolean
}
