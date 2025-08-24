import { useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { Text, Grid, usePaginatedData, Input } from "@julseb-lib/react"
import { AdminPage, ErrorMessage, Pagination, UserCardAdmin } from "components"
import { userService } from "api"

const Users: FC = () => {
	const { page } = Route.useLoaderDeps()
	const navigate = useNavigate()

	const {
		data: users,
		error,
		isError,
		isPending,
	} = useQuery({
		queryKey: ["users", page],
		queryFn: () => userService.allOtherUsers().then(res => res.data),
	})

	const [search, setSearch] = useState({ search: "", role: "none" })
	const handleSearch = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		setSearch({ ...search, [e.target.id]: e.target.value })
		navigate({ to: "/admin/users", params: { page: 1 } })
	}

	let allUsers = users ?? []

	if (search.search) {
		allUsers = allUsers.filter(user =>
			user.fullName.toLowerCase().includes(search.search.toLowerCase()),
		)
	}

	if (search.role !== "none") {
		allUsers = allUsers.filter(user => user.role === search.role)
	}

	const { paginatedData, totalPages } = usePaginatedData(
		allUsers,
		Number(page),
	)

	return (
		<AdminPage title="Users" isLoading={isPending}>
			<Text tag="h1">Users</Text>

			<Grid cols={2} gap="sm">
				<Input
					label="Search by name"
					id="search"
					value={search.search}
					onChange={handleSearch}
				/>

				<Input
					label="Filter by role"
					id="role"
					type="select"
					value={search.role}
					onChange={handleSearch}
				>
					<option value="none">None</option>
					<option value="user">User</option>
					<option value="admin">Admin</option>
				</Input>
			</Grid>

			{isError ? (
				<ErrorMessage>{error.message}</ErrorMessage>
			) : users?.length ? (
				allUsers?.length ? (
					<Grid cols={4} gap="sm">
						{paginatedData?.map(user => (
							<UserCardAdmin user={user} key={user._id} />
						))}
					</Grid>
				) : (
					<Text>Your search did not return any result.</Text>
				)
			) : (
				<Text>No user yet.</Text>
			)}

			<Pagination totalPages={totalPages} currentPage={Number(page)} />
		</AdminPage>
	)
}

export const Route = createFileRoute("/admin/users")({
	component: Users,
	validateSearch: (search: Record<string, unknown>): UsersPages => {
		return { page: Number(search.page ?? 1) }
	},
	loaderDeps: ({ search: { page } }) => ({ page }),
})

type UsersPages = {
	page?: number | null
}
