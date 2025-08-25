import { createFileRoute } from "@tanstack/react-router"
import { Section, Text } from "@julseb-lib/react"
import { AdminPage } from "components"
import { useAuth } from "context"
import { AllConversations } from "./-conversations"

const Admin: FC = () => {
	const { page } = Route.useSearch()

	const { user } = useAuth()

	return (
		<AdminPage title="Admin">
			<Text tag="h1">Hello {user?.fullName}</Text>

			<Section>
				<Text tag="h3">Conversations</Text>
				<AllConversations page={Number(page) ?? 1} />
			</Section>
		</AdminPage>
	)
}

export const Route = createFileRoute("/admin/")({
	component: Admin,
	validateSearch: (search: Record<string, unknown>): UsersPages => {
		return { page: Number(search.page ?? 1) }
	},
	loaderDeps: ({ search: { page } }) => ({ page }),
})

type UsersPages = {
	page?: number | null
}
