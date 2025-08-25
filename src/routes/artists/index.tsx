import { useEffect, useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import {
	Main,
	Aside,
	SrOnly,
	Button,
	slugify,
	usePaginatedData,
} from "@julseb-lib/react"
import { Page, Pagination } from "components"
import { userService } from "api"
import { SITE_DATA } from "data"
import { ArtistsList, SortArtists, ArtistFilters } from "./-artists-page"
import type { SortArtist, User } from "types"

const Artists: FC = () => {
	const navigate = useNavigate()
	const { page } = Route.useLoaderDeps()
	const search = Route.useSearch() as {
		city: string
		genre: string
		sort: SortArtist
		search?: string
	}

	const { data, error, isError, isPending, refetch } = useQuery<Array<User>>({
		queryKey: ["artists", page],
		queryFn: () => userService.allArtists(true).then(res => res.data),
	})

	const {
		data: prices,
		error: pricesError,
		isError: isPricesError,
		isPending: isPricesPending,
		refetch: refetchPrices,
	} = useQuery({
		queryKey: ["prices"],
		queryFn: () => userService.getPrices().then(res => res.data),
	})

	const [sorting, setSorting] = useState<SortArtist>(search.sort)
	const [filters, setFilters] = useState({
		minPrice: 0,
		maxPrice: 0,
		globalMinPrice: 0,
		globalMaxPrice: 0,
	})
	const [city, setCity] = useState(search.city ?? "All")
	const [genre, setGenre] = useState(search.genre ?? "All")

	const handleInitFilters = () =>
		setFilters({
			...filters,
			minPrice: prices![0],
			maxPrice: prices![prices!.length - 1],
			globalMinPrice: prices![0],
			globalMaxPrice: prices![prices!.length - 1],
		})

	useEffect(() => {
		if (prices) {
			handleInitFilters()
		}
	}, [prices])

	const handleReset = () => {
		navigate({ to: ".", search: { page: 1 } })
		setSorting(undefined)
		setCity("All")
		setGenre("All")
		refetch()
		refetchPrices()
		handleInitFilters()
	}

	let filteredArtists: Array<User> = data ?? []

	if (city !== "All") {
		filteredArtists = filteredArtists.filter(
			artist => slugify(artist.city) === slugify(city),
		)
	}

	if (genre !== "All") {
		filteredArtists = filteredArtists.filter(
			artist => slugify(artist.genre) === slugify(genre),
		)
	}

	if (filters.minPrice !== filters.globalMinPrice) {
		filteredArtists = filteredArtists.filter(
			artist => artist.price >= filters.minPrice,
		)
	}

	if (filters.maxPrice !== filters.globalMaxPrice) {
		filteredArtists = filteredArtists.filter(
			artist => artist.price <= filters.maxPrice,
		)
	}

	if (search.sort) {
		if (search.sort === "price") {
			filteredArtists = filteredArtists.sort((a, b) =>
				a.price < b.price ? -1 : 0,
			)
		}

		if (search.sort === "availability") {
			filteredArtists = filteredArtists.sort((a, b) =>
				new Date(a.available[0]) < new Date(b.available[0]) ? -1 : 0,
			)
		}
	}

	if (search.search) {
		filteredArtists = filteredArtists.filter(
			artist =>
				slugify(artist.fullName).includes(slugify(search.search!)) ||
				slugify(artist.city).includes(slugify(search.search!)) ||
				slugify(artist.genre).includes(slugify(search.search!)),
		)
	} else {
		navigate({ to: ".", search: { ...search, search: undefined } })
	}

	const { paginatedData, totalPages } = usePaginatedData(
		filteredArtists,
		page ?? 1,
		10,
	)

	return (
		<Page title="Artists" type="none" searchTerms={search.search} noMain>
			<Aside className="flex flex-col gap-6 p-0">
				<SortArtists
					sorting={sorting}
					setSorting={setSorting}
					search={search}
				/>

				<ArtistFilters
					inputs={filters}
					setInputs={setFilters}
					city={city}
					setCity={setCity}
					genre={genre}
					setGenre={setGenre}
					search={search}
				/>

				<Button onClick={handleReset}>Reset filters</Button>
			</Aside>

			<Main className="p-0">
				<SrOnly element="h1">{SITE_DATA.NAME}'s Artists</SrOnly>

				<ArtistsList
					paginatedData={paginatedData}
					isError={isError || isPricesError}
					error={error?.message || pricesError?.message}
					isLoading={isPending || isPricesPending}
				/>

				<Pagination totalPages={totalPages} currentPage={page ?? 1} />
			</Main>
		</Page>
	)
}

export const Route = createFileRoute("/artists/")({
	component: Artists,
	validateSearch: (search: Record<string, unknown>): UsersPages => {
		return { page: Number(search.page ?? 1) }
	},
	loaderDeps: ({ search: { page } }) => ({ page }),
})

type UsersPages = {
	page?: number | null
	sort?: SortArtist
	search?: string
	city?: string
	genre?: string
}
