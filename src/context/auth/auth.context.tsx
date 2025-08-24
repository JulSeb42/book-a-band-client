import { useState, useEffect, createContext, useContext } from "react"
import { authService } from "api"
import type { User } from "types"
import type { IAuthContext } from "./type"

const AuthContext = createContext<IAuthContext>(null as any)

export const AuthProviderWrapper: FC<{ children: Children }> = ({
	children,
}) => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(null as any)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [user, setUser] = useState<User | null>(null)

	const loginUser = (token: string) => {
		localStorage.setItem("authToken", token)
		setToken(token)
		verifyStoredToken()
	}

	const setToken = (token: string) => {
		localStorage.setItem("authToken", token)
		setIsLoggedIn(true)
	}

	const logoutUser = () => {
		localStorage.removeItem("authToken")
		setIsLoggedIn(false)
		setUser(null)
	}

	const verifyStoredToken = () => {
		const storedToken = localStorage.getItem("authToken")

		if (storedToken) {
			authService
				.loggedIn({
					headers: {
						Authorization: `Bearer ${storedToken}`,
					},
				})
				.then(res => {
					const user: User = res.data.user
					setUser(user)
					setIsLoggedIn(true)
					setIsLoading(false)
					localStorage.setItem("user_id", user._id)
				})
				.catch(err => {
					console.error(err)
					setIsLoggedIn(false)
					setUser(null)
					setIsLoading(false)
				})
		} else {
			setIsLoggedIn(false)
			setIsLoading(false)
		}
	}

	useEffect(() => {
		verifyStoredToken()
	}, [])

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn,
				isLoading,
				setUser,
				setToken,
				loginUser,
				logoutUser,
				user,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext) as IAuthContext
