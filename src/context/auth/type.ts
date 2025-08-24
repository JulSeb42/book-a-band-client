import type { User } from "types"

export interface IAuthContext {
	isLoggedIn: boolean
	isLoading: boolean
	user: User | null
	setUser: DispatchState<User | null>
	loginUser: (token: string) => void
	logoutUser: () => void
	setToken: (token: string) => void
}
