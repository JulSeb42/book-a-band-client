import { useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Text, Form, Input, emailRegex } from "@julseb-lib/react"
import { Page, ErrorMessage } from "components"
import { COMMON_TEXTS } from "data"
import { authService } from "api"
import type { LibValidationStatus } from "@julseb-lib/react/types"
import type { IErrorMessage } from "types"

const ForgotPassword: FC = () => {
	const navigate = useNavigate()

	const [email, setEmail] = useState(localStorage.getItem("email") ?? "")
	const [isLoading, setIsLoading] = useState(false)
	const [validation, setValidation] = useState<LibValidationStatus>(undefined)
	const [errorMessage, setErrorMessage] = useState<IErrorMessage>(undefined)

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		setIsLoading(true)

		if (!emailRegex.test(email)) {
			setValidation(false)
			return
		} else if (validation && emailRegex.test(email)) {
			setValidation(true)
		}

		authService
			.forgotPassword(email)
			.then(() => setTimeout(() => navigate({ to: "/forgot-sent" }), 300))
			.catch(err => {
				console.error(err)
				setErrorMessage(err.response.data.message)
			})
			.finally(() => setIsLoading(false))
	}

	return (
		<Page title="I forgot my password" type="anon" mainSize="form">
			<Text tag="h1">I forgot my password</Text>

			<Text>
				Please enter your email address, we will send you a link to
				reset your password.
			</Text>

			<Form
				buttonPrimary="Send"
				buttonSecondary={{
					content: "Cancel",
					onClick: () => navigate({ to: "/login" }),
				}}
				onSubmit={handleSubmit}
				isLoading={isLoading}
			>
				<Input
					type="email"
					label="Your email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					validation={{
						status: validation,
						message: COMMON_TEXTS.ERRORS.EMAIL_NOT_VALID,
					}}
				/>
			</Form>

			<ErrorMessage>{errorMessage}</ErrorMessage>
		</Page>
	)
}

export const Route = createFileRoute("/(auth)/forgot-password")({
	component: ForgotPassword,
})
