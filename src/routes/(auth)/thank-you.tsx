import { createFileRoute } from "@tanstack/react-router"
import { Text } from "@julseb-lib/react"
import { Page } from "components"

const ThankYou: FC = () => {
	return (
		<Page title="Thank You" type="protected">
			<Text tag="h1">Thank you for creating your account!</Text>

			<Text>
				You are now logged in. We just sent you an email to verify your
				account, please click on the link to access all the
				functionalities.
			</Text>
		</Page>
	)
}

export const Route = createFileRoute("/(auth)/thank-you")({
	component: ThankYou,
})
