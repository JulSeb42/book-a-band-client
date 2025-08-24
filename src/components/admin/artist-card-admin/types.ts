import type { User } from "types"

export interface IArtistCardAdmin {
	artist: User
	artists: Array<User>
	setArtists: DispatchState<Array<User>>
}
