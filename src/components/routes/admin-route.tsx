import { Navigate } from "@tanstack/react-router"
import { PageLoading } from "@julseb-lib/react"
import { useAuth } from "context"

export const AdminRoute: FC<IAdminRoute> = ({ children }) => {
	const { isLoggedIn, user, isLoading } = useAuth()

	if (isLoading) return <PageLoading />

	if (isLoggedIn && user?.role === "admin") return children

	return <Navigate to="/my-account" />
}

interface IAdminRoute {
	children: Children
}
