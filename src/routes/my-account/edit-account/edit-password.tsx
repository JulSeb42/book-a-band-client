import { createFileRoute, Navigate } from "@tanstack/react-router"
import { Text } from "@julseb-lib/react"
import { Page } from "components"
import { useAuth } from "context"
import { EditPasswordForm } from "./-forms/edit-password-form"

const EditPassword: FC = () => {
	const { user } = useAuth()

	if (user?.role === "admin")
		return <Navigate to="/admin/edit-account/edit-password" />

	return (
		<Page title="Edit Password" type="protected" mainSize="form">
			<Text tag="h1">Edit Password</Text>

			<EditPasswordForm />
		</Page>
	)
}

export const Route = createFileRoute("/my-account/edit-account/edit-password")({
	component: EditPassword,
})
