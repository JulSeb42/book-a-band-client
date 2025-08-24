import { useState } from "react"
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router"
import {
	Text,
	Form,
	Input,
	InputCheck,
	Autocomplete,
	passwordRegex,
	emailRegex,
	toast,
	clsx,
} from "@julseb-lib/react"
import { Page, ErrorMessage } from "components"
import { authService } from "api"
import { COMMON_TEXTS, GERMAN_CITIES } from "data"
import { useAuth } from "context"
import type { LibValidationStatus } from "@julseb-lib/react/types"
import type { IErrorMessage, UserRole } from "types"

const Signup: FC = () => {
	const { role = "user" } = Route.useSearch() as { role: UserRole }

	const { loginUser } = useAuth()
	const navigate = useNavigate()

	const [inputs, setInputs] = useState({
		fullName: "",
		email: "",
		password: "",
		city: "",
	})
	const [city, setCity] = useState("")
	const [savePassword, setSavePassword] = useState(true)
	const [validation, setValidation] = useState<{
		fullName: LibValidationStatus
		email: LibValidationStatus
		password: LibValidationStatus
		city: LibValidationStatus
	}>({
		fullName: undefined,
		email: undefined,
		password: undefined,
		city: undefined,
	})
	const [errorMessage, setErrorMessage] = useState<IErrorMessage>(undefined)
	const [userRole, setUserRole] = useState<UserRole>(role)
	const [isLoading, setIsLoading] = useState(false)

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target

		if (id === "city") {
			setCity(value)
		} else {
			setInputs({ ...inputs, [id]: value })
		}

		if (
			validation.fullName !== undefined ||
			validation.email !== undefined ||
			validation.password !== undefined ||
			validation.city !== undefined
		) {
			if (id === "fullName" && validation.fullName !== undefined) {
				if (value.length) {
					setValidation({ ...validation, fullName: true })
				} else setValidation({ ...validation, fullName: false })
			}

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

			if (id === "city" && validation.city !== undefined) {
				if (value.length) {
					setValidation({ ...validation, city: true })
				} else setValidation({ ...validation, city: false })
			}
		}
	}

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		if (
			!inputs.fullName.length ||
			!emailRegex.test(inputs.email) ||
			!passwordRegex.test(inputs.password) ||
			!city.length
		) {
			setValidation({
				fullName: !inputs.fullName.length ? false : undefined,
				email: !emailRegex.test(inputs.email) ? false : undefined,
				password: !passwordRegex.test(inputs.password)
					? false
					: undefined,
				city: !inputs.city.length ? false : undefined,
			})
			setIsLoading(false)
			return
		}

		if (savePassword) localStorage.setItem("email", inputs.email)

		authService
			.signup({ ...inputs, city, role: userRole })
			.then(res => {
				loginUser(res.data.authToken)
				toast.success("Your account has been created!")
			})
			.then(() => setTimeout(() => navigate({ to: "/thank-you" }), 300))
			.catch(err => setErrorMessage(err.response.data.message))
			.finally(() => setIsLoading(false))
	}

	return (
		<Page title="Signup" type="anon" mainSize="form">
			<div className="flex gap-2 bg-gray-200 p-2 rounded-lg w-full">
				<Link
					to="/signup"
					search={{ role: "user" }}
					onClick={() => setUserRole("user")}
					className={clsx(
						"rounded-md w-full font-bold text-center",
						role === "user" && "bg-primary-500 text-white",
					)}
				>
					As user
				</Link>
				<Link
					to="/signup"
					search={{ role: "artist" }}
					onClick={() => setUserRole("artist")}
					className={clsx(
						"rounded-md w-full font-bold text-center",
						role === "artist" && "bg-primary-500 text-white",
					)}
				>
					As artist
				</Link>
			</div>

			<Text tag="h1">Signup as {role}</Text>

			<Form
				buttonPrimary="Create your account"
				onSubmit={handleSubmit}
				isLoading={isLoading}
			>
				<Input
					label={role === "artist" ? "Display name" : "Full name"}
					id="fullName"
					value={inputs.fullName}
					onChange={handleChange}
					validation={{
						status: validation.fullName,
						message: COMMON_TEXTS.ERRORS.FULL_NAME_EMPTY,
					}}
				/>

				<Input
					label="Email"
					id="email"
					type="email"
					value={inputs.email}
					onChange={handleChange}
					validation={{
						status: validation.email,
						message: COMMON_TEXTS.ERRORS.EMAIL_NOT_VALID,
					}}
				/>

				<Input
					label="Password"
					id="password"
					type="password"
					value={inputs.password}
					onChange={handleChange}
					validation={{
						status: validation.password,
						message: COMMON_TEXTS.ERRORS.PASSWORD_NOT_VALID,
					}}
				/>

				<Autocomplete
					label="City"
					id="city"
					listResults={GERMAN_CITIES}
					value={city}
					setValue={setCity}
					validation={{
						status: validation.city,
						message: COMMON_TEXTS.ERRORS.CITY_REQUIRED,
					}}
				/>

				<InputCheck
					id="save"
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setSavePassword(e.target.checked)
					}
					variant="toggle"
					checked={savePassword}
				>
					Save your email for faster login?
				</InputCheck>
			</Form>

			<ErrorMessage>{errorMessage}</ErrorMessage>

			<Text>
				You already have an account? <Link to="/login">Log in.</Link>
			</Text>
		</Page>
	)
}

export const Route = createFileRoute("/(auth)/signup")({
	component: Signup,
})
