import { createFileRoute } from "@tanstack/react-router"
import { Text } from "@julseb-lib/react"
import { Page } from "components"

const ForgotSent: FC = () => {
	return (
		<Page title="Email has been sent" type="anon">
			<Text tag="h1">Email sent successfully!</Text>

			<Text>
				We just sent you an email with a link to reset your password.
			</Text>
		</Page>
	)
}

export const Route = createFileRoute("/(auth)/forgot-sent")({
	component: ForgotSent,
})
