import { createFileRoute } from "@tanstack/react-router"
import { Text } from "@julseb-lib/react"
import { Page } from "components"

const Goodbye: FC = () => {
	return (
		<Page title="Goodbye!" type="anon">
			<Text tag="h1">We're sorry to see you go!</Text>

			<Text>Your account was deleted successfully.</Text>
		</Page>
	)
}

export const Route = createFileRoute("/(auth)/goodbye")({
	component: Goodbye,
})
