import { http } from "./http-common"
import { generateServerRoute } from "utils"
import type { SERVER_PATHS } from "./server-paths"
import type { ApiResponse, EditPasswordFormData, User } from "types"

type PATHS = keyof typeof SERVER_PATHS.USERS

const generateRoute = (route: Exclude<PATHS, "ROOT">, id?: string) =>
	generateServerRoute("USERS", route, id)

class UserService {
	paginatedUsers = async (
		page: number,
		limit = 20,
	): Promise<{ users: Array<User>; hasMore: boolean }> =>
		(
			await http.get(
				generateRoute("ALL_USERS") +
					`?page=${page}&limit=${limit}&paginated=true`,
			)
		).data

	allUsers = async (): ApiResponse<Array<User>> =>
		await http.get(generateRoute("ALL_USERS"))

	allArtists = async (approved?: boolean): ApiResponse<Array<User>> =>
		await http.get(generateRoute("ALL_ARTISTS") + `?approved=${approved}`)

	allOtherUsers = async (): ApiResponse<Array<User>> =>
		await http.get(generateRoute("ALL_OTHER_USERS"))

	allCities = async (): ApiResponse<Array<string>> =>
		await http.get(generateRoute("GET_ALL_CITIES"))

	allGenres = async (): ApiResponse<Array<string>> =>
		await http.get(generateRoute("GET_ALL_GENRES"))

	getPrices = async (): ApiResponse<Array<number>> =>
		await http.get(generateRoute("GET_PRICES"))

	getUser = async (id: string): ApiResponse<User> =>
		await http.get(generateRoute("GET_USER", id))

	getArtistBySlug = async (slug: string): ApiResponse<User> =>
		await http.get(generateRoute("ARTIST_BY_SLUG", slug))

	editAccount = async (id: string, data: {}) =>
		await http.put(generateRoute("EDIT_ACCOUNT", id), data)

	editPassword = async (id: string, data: EditPasswordFormData) =>
		await http.put(generateRoute("EDIT_PASSWORD", id), data)

	adminResetPassword = async () => await http.put("")

	deleteAccount = async (id: string) =>
		await http.delete(generateRoute("DELETE_ACCOUNT", id))
}

export const userService = new UserService()
