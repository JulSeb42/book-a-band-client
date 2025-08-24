/*
    Create API link
*/

import axios from "axios"

const BASE_API_URL = `${import.meta.env.VITE_API_URL}/api`

export const http = axios.create({
	baseURL: BASE_API_URL,
	headers: {
		"Content-type": "application/json",
	},
	withCredentials: true,
})
