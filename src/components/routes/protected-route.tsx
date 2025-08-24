import { Navigate } from "@tanstack/react-router"
import { PageLoading } from "@julseb-lib/react"
import { useAuth } from "context"

export const ProtectedRoute: FC<IProtectedRoute> = ({ children }) => {
	const { isLoggedIn, isLoading } = useAuth()

	if (isLoading) return <PageLoading />

	if (isLoggedIn) return children

	return <Navigate to="/login" />
}

interface IProtectedRoute {
	children: Children
}
