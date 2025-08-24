import { Grid, Input, Select } from "@julseb-lib/react"
import type { ReadFilter } from ".."

export const SearchConversations: FC<ISearchConversations> = ({
	search,
	setSearch,
	filter,
	setFilter,
}) => {
	return (
		<search>
			<Grid cols={2} gap="md">
				<Input
					type="search"
					label="Search by name"
					id="search"
					value={search}
					onChange={e => setSearch(e.target.value)}
					clearSearch={() => setSearch("")}
				/>

				<Select
					type="button"
					label="Filter by status"
					id="filter"
					value={filter}
					setValue={setFilter as any}
					options={["All", "Unread", "Read"]}
				/>
			</Grid>
		</search>
	)
}

interface ISearchConversations {
	search: string
	setSearch: DispatchState<string>
	filter: ReadFilter
	setFilter: DispatchState<ReadFilter>
}
