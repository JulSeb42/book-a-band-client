import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import {
	PageLoading,
	Text,
	Aside,
	Main,
	MarkdownContainer,
	Section,
} from "@julseb-lib/react"
import { Page } from "components"
import { userService } from "api"
import { ErrorPage } from "pages"
import { useAuth } from "context"
import {
	UserAvatar,
	UserInfo,
	ContactArtist,
	NextAvailabilities,
} from "./-artist-page"

const Artist: FC = () => {
	const navigate = useNavigate()

	const { artist: slug } = Route.useParams()
	const { isLoggedIn, user } = useAuth()

	const {
		data: artist,
		isError,
		error,
		isPending,
	} = useQuery({
		queryKey: ["artist"],
		queryFn: () => userService.getArtistBySlug(slug).then(res => res.data),
	})

	if (isPending) return <PageLoading />

	if (isError) return <ErrorPage message={error.message} />

	setTimeout(() => {
		if (
			artist.approved === false &&
			(!isLoggedIn ||
				(user?.role !== "admin" && user?._id !== artist._id))
		)
			navigate({ to: "/artists" })
	}, 1000)

	return (
		<Page
			title={
				isPending ? "Loading..." : isError ? "Error" : artist.fullName
			}
			type="none"
			noMain
		>
			<Aside className="flex flex-col items-center p-0">
				<UserAvatar artist={artist} />
			</Aside>

			<Main className="p-0">
				<Text tag="h1">{artist.fullName}</Text>

				<UserInfo artist={artist} />

				<MarkdownContainer>{artist?.bio}</MarkdownContainer>

				<Section gap="sm">
					<Text tag="h3">Contact {artist?.fullName}</Text>
					<ContactArtist artist={artist} />
				</Section>
			</Main>

			<Aside className="flex flex-col gap-6 p-0">
				<NextAvailabilities artist={artist} />
			</Aside>
		</Page>
	)
}

export const Route = createFileRoute("/artists/$artist")({
	component: Artist,
})
