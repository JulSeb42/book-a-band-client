import type { User } from "types"

export const emptyUser: User = {
	_id: "",
	email: "",
	fullName: "",
	password: "",
	verified: false,
	verifyToken: "",
	resetToken: "",
	avatar: "",
	role: "user",
	city: "Berlin",
	genre: "",
	bio: "",
	price: 0,
	available: [],
	youtubeUrl: "",
	instagramUrl: "",
	facebookUrl: "",
	youtubeLinks: [],
	slug: "",
	approved: false,
}
