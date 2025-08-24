import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Text, Flexbox, Grid, Input, Select, slugify } from "@julseb-lib/react"
import { InputSkeleton } from "components"
import { userService } from "api"
import type { SortArtist } from "types"

export const ArtistFilters: FC<IArtistFilters> = ({
	inputs,
	setInputs,
	search,
	city,
	setCity,
	genre,
	setGenre,
}) => {
	const navigate = useNavigate()

	const [allCities, setAllCities] = useState<Array<string>>([])
	const [allGenres, setAllGenres] = useState<Array<string>>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		userService
			.allCities()
			.then(res => setAllCities(res.data))
			.catch(err => console.error(err))
		userService
			.allGenres()
			.then(res => setAllGenres(res.data))
			.catch(err => console.error(err))
			.finally(() => setIsLoading(false))
	}, [city, genre])

	useEffect(() => {
		if (city !== "All") {
			search = { ...search, city }
			navigate({ to: ".", search: { ...search, city: slugify(city) } })
		} else if (city === "All") {
			search = { ...search, city: undefined as any }
			navigate({ to: ".", search: { ...search, city: undefined } })
		}

		if (genre !== "All") {
			search = { ...search, genre }
			navigate({ to: ".", search: { ...search, genre: slugify(genre) } })
		} else {
			search = { ...search, genre: "All" }
			navigate({ to: ".", search: { ...search, genre: undefined } })
		}
	}, [city, genre])

	const handleInputs = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => setInputs({ ...inputs, [e.target.id]: e.target.value })

	return (
		<Flexbox flexDirection="col" gap="xs">
			<Text tag="h5">Filters</Text>

			<Grid cols={2} gap="sm">
				{isLoading ? (
					<>
						<InputSkeleton label="Min price" />
						<InputSkeleton label="Max price" />
					</>
				) : (
					<>
						<Input
							id="minPrice"
							label="Min price"
							min={inputs.globalMinPrice}
							max={inputs.maxPrice}
							value={inputs.minPrice}
							onChange={handleInputs}
							type="number"
						/>
						<Input
							id="maxPrice"
							label="Max price"
							min={inputs.minPrice}
							max={inputs.globalMaxPrice}
							value={inputs.maxPrice}
							onChange={handleInputs}
							type="number"
						/>
					</>
				)}
			</Grid>

			{isLoading ? (
				<>
					<InputSkeleton label="City" />
					<InputSkeleton label="Genre" />
				</>
			) : (
				<>
					<Select
						id="city"
						label="City"
						options={["All", ...allCities]}
						value={city}
						setValue={setCity}
					/>

					<Select
						id="genre"
						label="Genre"
						options={["All", ...allGenres]}
						value={genre}
						setValue={setGenre}
					/>
				</>
			)}
		</Flexbox>
	)
}

interface IArtistFilters {
	inputs: FilterInputs
	setInputs: DispatchState<FilterInputs>
	city: string
	setCity: DispatchState<string>
	genre: string
	setGenre: DispatchState<string>
	search: {
		sort: SortArtist
		city: string
		genre: string
	}
}

export type FilterInputs = {
	minPrice: number
	maxPrice: number
	globalMinPrice: number
	globalMaxPrice: number
	// city: string
	// genre: string
}
