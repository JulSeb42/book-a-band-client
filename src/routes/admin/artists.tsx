import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Section, Text } from "@julseb-lib/react"
import { AdminPage } from "components"
import { ArtistsFilters, ArtistsList } from "./-artists-page"

export type Filter = "All" | "Approved" | "Not approved"

const AdminArtists: FC = () => {
	const { page } = Route.useSearch()

	const [inputs, setInputs] = useState<{
		search: string
		filter: Filter
	}>({
		search: "",
		filter: "All",
	})

	return (
		<AdminPage title="Artists">
			<Text tag="h1">Artists</Text>

			<Section>
				<Text tag="h3">All artists</Text>

				<ArtistsFilters inputs={inputs} setInputs={setInputs} />

				<ArtistsList page={Number(page)} inputs={inputs} />
			</Section>
		</AdminPage>
	)
}

export const Route = createFileRoute("/admin/artists")({
	component: AdminArtists,
	validateSearch: (search: Record<string, unknown>): UsersPages => {
		return { page: Number(search.page ?? 1) }
	},
	loaderDeps: ({ search: { page } }) => ({ page }),
})

type UsersPages = {
	page?: number | null
}
