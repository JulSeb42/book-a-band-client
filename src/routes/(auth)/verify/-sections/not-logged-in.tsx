import { Text } from "@julseb-lib/react"
import { Page } from "components"

export const NotLoggedIn: FC = () => {
	return (
		<Page title="Verify your account" type="anon">
			<Text tag="h1">You are not logged in!</Text>

			<Text>Please log in to verify your account.</Text>
		</Page>
	)
}
