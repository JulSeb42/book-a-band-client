import { useState } from "react"
import { createFileRoute, Navigate } from "@tanstack/react-router"
import { Main, Aside } from "@julseb-lib/react"
import { Page } from "components"
import { useAuth } from "context"
import {
	UserAsideLeft,
	UserHeader,
	SearchConversations,
	UserConversations,
	NotApproved,
} from "./-my-account-page"

export type ReadFilter = "All" | "Unread" | "Read"

const MyAccount: FC = () => {
	const { user, isLoading } = useAuth()

	const [search, setSearch] = useState("")
	const [filter, setFilter] = useState<ReadFilter>("All")

	if (user?.role === "admin") return <Navigate to="/admin" />

	return (
		<Page title="My Account" type="protected" isLoading={isLoading} noMain>
			<Aside className="flex flex-col items-center gap-6 p-0">
				<UserAsideLeft />
			</Aside>

			<Main className="p-0">
				<UserHeader />

				<NotApproved />

				<SearchConversations
					search={search}
					setSearch={setSearch}
					filter={filter}
					setFilter={setFilter}
				/>

				<UserConversations search={search} filter={filter} />
			</Main>

			<Aside className="p-0"></Aside>
		</Page>
	)
}

export const Route = createFileRoute("/my-account/")({
	component: MyAccount,
})
