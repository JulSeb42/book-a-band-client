import { useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import {
	Text,
	Image,
	clsx,
	Select,
	Button,
	Flexbox,
	Skeleton,
} from "@julseb-lib/react"
import { Page } from "components"
import { userService } from "api"

const App: FC = () => {
	const navigate = useNavigate()

	const {
		data: cities,
		isPending: isCitiesPending,
		isError: isCitiesError,
		error: citiesError,
	} = useQuery({
		queryKey: ["cities"],
		queryFn: () =>
			userService.allCities().then(res => ["All", ...res.data]),
	})

	const {
		data: genres,
		isPending: isGenresPending,
		isError: isGenresError,
		error: genresError,
	} = useQuery({
		queryKey: ["genres"],
		queryFn: () =>
			userService.allGenres().then(res => ["All", ...res.data]),
	})

	const [city, setCity] = useState("All")
	const [genre, setGenre] = useState("All")

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		const selectedCity = city === "All" ? undefined : city
		const selectedGenre = genre === "All" ? undefined : genre

		navigate({
			to: "/artists",
			search: { city: selectedCity, genre: selectedGenre },
		})
	}

	return (
		<Page title="Homepage" type="none" noWrapper noHeader noFooter>
			<main className="relative flex flex-col justify-start items-start gap-2 w-full h-svh">
				<Image
					src="/images/cover-home.jpg"
					alt="Cover"
					className="z-0 fixed size-full"
					fit="cover"
				/>

				<div className="top-0 left-0 z-10 fixed bg-overlay-gradient-black size-full" />

				<section
					className={clsx(
						"z-20 relative flex flex-col justify-center items-center gap-2 size-full",
					)}
				>
					<Image
						src="/images/logo-white.svg"
						alt="Logo Book a Band"
					/>

					<Text tag="h1" color="white">
						Book an artist / a band for your next event!
					</Text>

					<form
						className="bg-white p-4 rounded-lg w-full max-w-[calc(600px+32px)]"
						onSubmit={handleSubmit}
					>
						<search className="flex items-end gap-2 [&>div]:w-full">
							{isCitiesPending ? (
								<Flexbox flexDirection="col" gap="2xs">
									<Text color="primary">Cities</Text>
									<Skeleton
										className="rounded-md w-full h-8"
										animation="shine"
									/>
								</Flexbox>
							) : isCitiesError ? (
								<Text>{citiesError.message}</Text>
							) : (
								<Select
									label="City"
									options={cities as Array<string>}
									value={city}
									setValue={setCity}
									type="button"
									tabIndex={1}
									className="[&_.input-list]:overflow-y-scroll!"
								/>
							)}

							{isGenresPending ? (
								<Flexbox flexDirection="col" gap="2xs">
									<Text color="primary">Genres</Text>
									<Skeleton
										className="rounded-md w-full h-8"
										animation="shine"
									/>
								</Flexbox>
							) : isGenresError ? (
								<Text>{genresError.message}</Text>
							) : (
								<Select
									label="Genre"
									options={genres as Array<string>}
									value={genre}
									setValue={setGenre}
									type="button"
									tabIndex={2}
								/>
							)}

							<Button
								type="submit"
								tabIndex={3}
								size="small"
								className="self-end"
								isLoading={isCitiesPending || isGenresPending}
							>
								Search
							</Button>
						</search>
					</form>
				</section>
			</main>
		</Page>
	)
}

export const Route = createFileRoute("/")({
	component: App,
})
