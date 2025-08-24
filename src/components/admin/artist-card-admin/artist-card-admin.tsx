import { useState } from "react"
import { Link } from "@tanstack/react-router"
import {
	Text,
	Image,
	Flexbox,
	InputCheck,
	clsx,
	toast,
	deleteDuplicates,
} from "@julseb-lib/react"
import { adminService } from "api"
import type { IArtistCardAdmin } from "./types"

export const ArtistCardAdmin: FC<IArtistCardAdmin> = ({
	artist,
	artists,
	setArtists,
}) => {
	const [isApproved, setIsApproved] = useState(artist.approved)

	const handleApprove = () => {
		if (artist.approved === false) {
			setIsApproved(true)
			adminService
				.approveArtist(artist._id, { approved: true })
				.then(res => {
					const updatedArtist = artists.find(
						a => a._id === res.data._id,
					)
					updatedArtist!.approved = true
					setArtists(prev =>
						deleteDuplicates([...prev, updatedArtist!]),
					)
					toast.success(`${artist.fullName} is now approved!`)
				})
				.catch(err => console.error(err))
		} else {
			setIsApproved(false)
			adminService
				.approveArtist(artist._id, { approved: false })
				.then(res => {
					const updatedArtist = artists.find(
						a => a._id === res.data._id,
					)
					updatedArtist!.approved = false
					setArtists(prev =>
						deleteDuplicates([...prev, updatedArtist!]),
					)
					toast.success(`${artist.fullName} is not approved anymore!`)
				})
				.catch(err => console.error(err))
		}
	}

	return (
		<Flexbox
			justifyContent="space-between"
			className={clsx("", "artist-card-admin")}
		>
			<Flexbox alignItems="center" gap="xs">
				<Link to="/artists/$artist" params={{ artist: artist.slug }}>
					<Image
						src={artist.avatar}
						alt={`Avatar ${artist.fullName}`}
						fit="cover"
						className="rounded-full size-12"
					/>
				</Link>

				<Text>
					<Link
						to="/artists/$artist"
						params={{ artist: artist.slug }}
					>
						{artist.fullName}
					</Link>
				</Text>
			</Flexbox>

			<Flexbox>
				<InputCheck
					id={`approve-${artist._id}`}
					variant="toggle"
					checked={isApproved}
					onChange={handleApprove}
				>
					Approved
				</InputCheck>
			</Flexbox>
		</Flexbox>
	)
}
