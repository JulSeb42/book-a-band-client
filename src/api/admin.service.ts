import { http } from "./http-common"
import { generateServerRoute } from "utils"
import type { SERVER_PATHS } from "./server-paths"
import type { ApiResponse, UserRole, User } from "types"

type PATHS = keyof typeof SERVER_PATHS.ADMIN

const generateRoute = (route: Exclude<PATHS, "ROOT">, id?: string) =>
	generateServerRoute("ADMIN", route, id)

class AdminService {
	editUserRole = async (
		id: string,
		data: { role: UserRole },
	): ApiResponse<User> => await http.put(generateRoute("EDIT_ROLE", id), data)

	resetPassword = async (id: string): ApiResponse<{ message: string }> =>
		await http.post(generateRoute("RESET_PASSWORD", id))

	deleteUser = async (id: string): ApiResponse<{ message: string }> =>
		await http.delete(generateRoute("DELETE_USER", id))
}

export const adminService = new AdminService()
