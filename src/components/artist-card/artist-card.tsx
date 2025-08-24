import { Link } from "@tanstack/react-router"
import { BiMap } from "react-icons/bi"
import {
	Image,
	Text,
	Button,
	Flexbox,
	clsx,
	slugify,
	convertPrice,
	convertDateShort,
} from "@julseb-lib/react"
import type { IArtistCard } from "./types"

export const ArtistCard: FC<IArtistCard> = ({ artist }) => {
	const info: Array<{ title: string; content: string }> = [
		{ title: "Genre", content: artist.genre },
		{
			title: "Next availability",
			content: artist.available.length
				? convertDateShort(artist.available[0])
				: "-",
		},
		{
			title: "Price",
			content: convertPrice(artist.price).replaceAll(",00", ""),
		},
	]

	return (
		<div className={clsx("flex items-center gap-4", "artist-card")}>
			<Link
				to="/artists/$artist"
				params={{ artist: slugify(artist.fullName) }}
				className={clsx("rounded-full size-32 overflow-hidden")}
				onClick={() => setTimeout(() => window.location.reload(), 1)}
			>
				<Image
					src={artist.avatar}
					alt={`Avatar ${artist.fullName}`}
					className="size-full"
					fit="cover"
				/>
			</Link>

			<div className="w-[calc(100%-128px)]">
				<Flexbox justifyContent="space-between" gap="xs">
					<Text tag="h4">
						<Link
							to="/artists/$artist"
							params={{ artist: slugify(artist.fullName) }}
							onClick={() =>
								setTimeout(() => window.location.reload(), 1)
							}
						>
							{artist.fullName}
						</Link>
					</Text>

					<Text tag="small" className="inline-flex items-center">
						<BiMap /> {artist.city}
					</Text>
				</Flexbox>

				<Flexbox alignItems="end">
					<Flexbox flexDirection="col" gap="xs" className="w-full">
						{info.map((info, i) => (
							<Text key={i}>
								<Text tag="strong">{info.title}: </Text>
								{info.content}
							</Text>
						))}
					</Flexbox>

					<Button
						element={Link}
						// @ts-expect-error
						to="/artists/$artist"
						params={{ artist: slugify(artist.fullName) }}
						className="self-end whitespace-pre"
						onClick={() =>
							setTimeout(() => window.location.reload(), 1)
						}
					>
						See their page
					</Button>
				</Flexbox>
			</div>
		</div>
	)
}
