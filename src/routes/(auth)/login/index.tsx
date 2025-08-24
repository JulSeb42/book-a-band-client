import { useState } from "react"
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router"
import {
	Text,
	Form,
	Input,
	InputCheck,
	emailRegex,
	passwordRegex,
	toast,
} from "@julseb-lib/react"
import { Page, ErrorMessage } from "components"
import { useAuth } from "context"
import { authService } from "api"
import { COMMON_TEXTS } from "data"
import { DemoLogin } from "./-demo-login"
import type { LibValidationStatus } from "@julseb-lib/react/types"
import type { IErrorMessage } from "types"

const Login: FC = () => {
	const navigate = useNavigate()
	const { loginUser } = useAuth()

	const [inputs, setInputs] = useState({
		email: localStorage.getItem("email") ?? "",
		password: "",
	})
	const [savePassword, setSavePassword] = useState(
		!!localStorage.getItem("email"),
	)
	const [validation, setValidation] = useState<{
		email: LibValidationStatus
		password: LibValidationStatus
	}>({ email: undefined, password: undefined })
	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState<IErrorMessage>(undefined)

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target

		setInputs({ ...inputs, [id]: value })

		if (
			validation.email !== undefined ||
			validation.password !== undefined
		) {
			if (id === "email" && validation.email !== undefined) {
				if (emailRegex.test(value))
					setValidation({ ...validation, email: true })
				else setValidation({ ...validation, email: false })
			}

			if (id === "password" && validation.password !== undefined) {
				if (passwordRegex.test(value))
					setValidation({ ...validation, password: true })
				else setValidation({ ...validation, password: false })
			}
		}
	}

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		if (!inputs.email.length || !inputs.password.length) {
			setValidation({
				email: !inputs.email.length ? false : undefined,
				password: !inputs.password.length ? false : undefined,
			})
			return
		}

		if (savePassword) localStorage.setItem("email", inputs.email)

		authService
			.login(inputs)
			.then(res => {
				loginUser(res.data.authToken)
				toast.success("You are now logged in!")
			})
			.then(() => setTimeout(() => navigate({ to: "/my-account" }), 300))
			.catch(err => {
				console.error(err)
				setErrorMessage(err.response.data.message)
			})
			.finally(() => setIsLoading(false))
	}

	return (
		<Page title="Login" type="anon" mainSize="form">
			<Text tag="h1">Login</Text>

			<Form
				onSubmit={handleSubmit}
				isLoading={isLoading}
				buttonPrimary="Login"
			>
				<Input
					id="email"
					label="Email"
					type="email"
					value={inputs.email}
					onChange={handleChange}
					validation={{
						status: validation.email,
						message: COMMON_TEXTS.ERRORS.EMAIL_NOT_VALID,
					}}
				/>

				<Input
					id="password"
					label="Password"
					type="password"
					value={inputs.password}
					onChange={handleChange}
					validation={{
						status: validation.password,
						message: COMMON_TEXTS.ERRORS.PASSWORD_NOT_VALID,
					}}
				/>

				<InputCheck
					id="save"
					checked={savePassword}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setSavePassword(e.target.checked)
					}
					variant="toggle"
				>
					Save your email for faster login?
				</InputCheck>
			</Form>

			<ErrorMessage>{errorMessage}</ErrorMessage>

			<Text>
				<Link to="/forgot-password">I forgot my password.</Link>
			</Text>

			<Text>
				You don't have an account? <Link to="/signup">Sign up.</Link>
			</Text>

			<DemoLogin setIsLoading={setIsLoading} />
		</Page>
	)
}

export const Route = createFileRoute("/(auth)/login/")({
	component: Login,
})
