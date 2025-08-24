import { useNavigate } from "@tanstack/react-router"
import { Text, Button, Flexbox, toast } from "@julseb-lib/react"
import { authService } from "api"
import { useAuth } from "context"
import type { UserRole } from "types"

export const DemoLogin: FC<{ setIsLoading: DispatchState<boolean> }> = ({
	setIsLoading,
}) => {
	const navigate = useNavigate()

	const { loginUser } = useAuth()

	const handleLogin = (role: UserRole) => {
		authService
			.login({
				email:
					role === "admin"
						? import.meta.env.VITE_DEMO_EMAIL_ADMIN
						: role === "artist"
							? import.meta.env.VITE_DEMO_EMAIL_ARTIST
							: import.meta.env.VITE_DEMO_EMAIL_USER,
				password: import.meta.env.VITE_DEMO_PASSWORD,
			})
			.then(res => {
				loginUser(res.data.authToken)
				toast.success("You are now logged in!")
			})
			.then(() => setTimeout(() => navigate({ to: "/my-account" }), 300))
			.catch(err => {
				console.error(err)
				toast.error("An error occurred, check console")
			})
			.finally(() => setIsLoading(false))
	}

	if (import.meta.env.VITE_DEMO_ENV !== "local") return null

	return (
		<>
			<Text tag="h4">Demo login</Text>

			<Flexbox gap="md" justifyContent="stretch">
				<Button
					onClick={() => handleLogin("admin")}
					className="justify-center justify-self-stretch w-full whitespace-pre"
				>
					Login as admin
				</Button>

				<Button
					onClick={() => handleLogin("artist")}
					className="justify-center justify-self-stretch w-full whitespace-pre"
				>
					Login as artist
				</Button>

				<Button
					onClick={() => handleLogin("user")}
					className="justify-center justify-self-stretch w-full whitespace-pre"
				>
					Login as user
				</Button>
			</Flexbox>
		</>
	)
}
