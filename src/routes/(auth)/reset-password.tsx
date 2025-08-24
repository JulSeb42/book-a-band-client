import { useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Text, Form, Input, passwordRegex, toast } from "@julseb-lib/react"
import { Page, ErrorMessage } from "components"
import { COMMON_TEXTS } from "data"
import { authService } from "api"
import type { LibValidationStatus } from "@julseb-lib/react/types"
import type { IErrorMessage } from "types"

const ResetPassword: FC = () => {
	const navigate = useNavigate()
	const { id, token } = Route.useSearch() as { id: string; token: string }

	const [password, setPassword] = useState("")
	const [validation, setValidation] = useState<LibValidationStatus>(undefined)
	const [errorMessage, setErrorMessage] = useState<IErrorMessage>(undefined)
	const [isLoading, setIsLoading] = useState(false)

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)

		if (!passwordRegex.test(e.target.value)) {
			setValidation(false)
		} else {
			setValidation(true)
		}
	}

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		if (!passwordRegex.test(password)) {
			setValidation(false)
			return
		}

		authService
			.resetPassword({ _id: id, password, resetToken: token })
			.then(res => toast.success(res.data.message))
			.then(() => setTimeout(() => navigate({ to: "/login" })))
			.catch(err => {
				console.error(err)
				setErrorMessage(err.response.data.message)
			})
			.finally(() => setIsLoading(false))
	}

	return (
		<Page title="Reset your password" type="anon" mainSize="form">
			<Text tag="h1">Reset your password</Text>

			<Form
				buttonPrimary="Save new password"
				buttonSecondary={{
					content: "Cancel",
					onClick: () => navigate({ to: "/login" }),
				}}
				onSubmit={handleSubmit}
				isLoading={isLoading}
			>
				<Input
					label="New password"
					type="password"
					value={password}
					onChange={handleChange}
					validation={{
						status: validation,
						message: COMMON_TEXTS.ERRORS.PASSWORD_NOT_VALID,
					}}
				/>
			</Form>

			<ErrorMessage>{errorMessage}</ErrorMessage>
		</Page>
	)
}

export const Route = createFileRoute("/(auth)/reset-password")({
	component: ResetPassword,
})
