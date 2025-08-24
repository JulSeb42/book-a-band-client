import { useNavigate } from "@tanstack/react-router"
import { Text, Flexbox, InputCheck } from "@julseb-lib/react"
import type { SortArtist } from "types"

export const SortArtists: FC<ISortArtists> = ({
	sorting,
	setSorting,
	search,
}) => {
	const navigate = useNavigate()

	return (
		<Flexbox flexDirection="col" gap="xs">
			<Text tag="h5">Sort by</Text>

			<Flexbox gap="md">
				<InputCheck
					id="price"
					variant="selector"
					type={sorting ? "radio" : "checkbox"}
					checked={sorting === "price"}
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						if (e.target.checked) setSorting("price")
						navigate({
							to: "/artists",
							search: {
								...search,
								sort: "price",
							},
						})
					}}
				>
					Price
				</InputCheck>

				<InputCheck
					id="availability"
					variant="selector"
					type="radio"
					checked={sorting === "availability"}
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						if (e.target.checked) setSorting("availability")
						navigate({
							to: "/artists",
							search: {
								...search,
								sort: "availability",
							},
						})
					}}
				>
					Availability
				</InputCheck>
			</Flexbox>
		</Flexbox>
	)
}

interface ISortArtists {
	sorting: SortArtist
	setSorting: DispatchState<SortArtist>
	search: {
		city: string
		genre: string
		sort: SortArtist
		search?: string
	}
}
