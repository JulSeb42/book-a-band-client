import { useNavigate } from "@tanstack/react-router"
import { Input, Flexbox } from "@julseb-lib/react"
import type { Filter } from "../artists"

export const ArtistsFilters: FC<IArtistsFilters> = ({ inputs, setInputs }) => {
	const navigate = useNavigate()

	const handleInputs = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		setInputs({ ...inputs, [e.target.id]: e.target.value })

		navigate({ to: ".", search: { page: 1 } })
	}

	return (
		<Flexbox gap="sm" element="search" className="w-full [&>*]:w-full">
			<Input
				id="search"
				label="Search"
				value={inputs.search}
				onChange={handleInputs}
				type="search"
				clearSearch={() => setInputs({ ...inputs, search: "" })}
			/>

			<Input
				id="filter"
				label="Filter"
				value={inputs.filter}
				onChange={handleInputs}
				type="select"
			>
				<option value="All">All</option>
				<option value="Approved">Approved</option>
				<option value="Not approved">Not Approved</option>
			</Input>
		</Flexbox>
	)
}

interface IArtistsFilters {
	inputs: { search: string; filter: Filter }
	setInputs: DispatchState<{ search: string; filter: Filter }>
}
