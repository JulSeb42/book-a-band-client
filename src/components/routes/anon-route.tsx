import { Navigate } from "@tanstack/react-router"
import { PageLoading } from "@julseb-lib/react"
import { useAuth } from "context"

export const AnonRoute: FC<IAnonRoute> = ({ children }) => {
	const { isLoggedIn, isLoading } = useAuth()

	if (isLoading) return <PageLoading />

	if (!isLoggedIn) return children

	return <Navigate to="/" />
}

interface IAnonRoute {
	children: Children
}
