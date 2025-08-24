import { useState, useEffect, Fragment } from "react"
import { Hr, Text, usePaginatedData, slugify } from "@julseb-lib/react"
import { ErrorMessage, ArtistCardAdmin, Pagination } from "components"
import { userService } from "api"
import type { Filter } from "../artists"
import type { IErrorMessage, User } from "types"

export const ArtistsList: FC<IArtistsList> = ({ page, inputs }) => {
	const [artists, setArtists] = useState<Array<User>>([])
	const [isLoading, setIsLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState<IErrorMessage>(undefined)

	useEffect(() => {
		if (isLoading) {
			userService
				.allArtists()
				.then(res => setArtists(res.data))
				.catch(err => setErrorMessage(err.response.data.message))
				.finally(() => setIsLoading(false))
		}
	}, [isLoading, artists])

	const { search, filter } = inputs

	let filteredArtists: Array<User> = artists

	if (search) {
		filteredArtists = filteredArtists.filter(artist =>
			slugify(artist.fullName).includes(slugify(search)),
		)
	}

	if (filter !== "All") {
		if (filter === "Approved") {
			filteredArtists = filteredArtists.filter(
				artist => artist.approved === true,
			)
		}

		if (filter === "Not approved") {
			filteredArtists = filteredArtists.filter(
				artist => artist.approved === false,
			)
		}
	}

	if (isLoading) return null // TODO: add skeleton

	if (errorMessage) return <ErrorMessage>{errorMessage}</ErrorMessage>

	const { paginatedData, totalPages } = usePaginatedData(
		filteredArtists,
		page,
		10,
	)

	return (
		<>
			{paginatedData.length ? (
				paginatedData.map((artist, i) => (
					<Fragment key={artist._id}>
						<ArtistCardAdmin
							artist={artist}
							artists={artists}
							setArtists={setArtists}
						/>

						{i !== filteredArtists.length - 1 && <Hr />}
					</Fragment>
				))
			) : (
				<Text>Your search did not return any result.</Text>
			)}

			<Pagination totalPages={totalPages} currentPage={page} />
		</>
	)
}

interface IArtistsList {
	page: number
	inputs: { search: string; filter: Filter }
}
