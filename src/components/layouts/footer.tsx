import { Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import {
	BiChevronRight,
	BiLogoInstagram,
	BiLogoFacebookSquare,
} from "react-icons/bi"
import { Section, Text, Skeleton, Flexbox, clsx } from "@julseb-lib/react"
import { SITE_DATA } from "data"
import { userService } from "api"

export const Footer: FC = () => {
	const {
		data: cities,
		isError,
		error,
		isPending,
	} = useQuery({
		queryKey: ["cities"],
		queryFn: () => userService.allCities().then(res => res.data),
	})

	return (
		<footer
			className={clsx(
				"gap-2 grid grid-cols-3 bg-gray-200 px-[5%] py-6",
				"footer",
			)}
		>
			<Section gap="xs">
				<Text tag="h3">{SITE_DATA.NAME}</Text>

				{isPending ? (
					<>
						<Skeleton
							className="bg-gray-300 w-[70%] h-[26px]"
							animation="shine"
						/>
						<Skeleton
							className="bg-gray-300 w-[70%] h-[26px]"
							animation="shine"
						/>
						<Skeleton
							className="bg-gray-300 w-[70%] h-[26px]"
							animation="shine"
						/>
					</>
				) : isError ? (
					<Text>{error.message}</Text>
				) : (
					cities.map(city => (
						<Text key={city}>
							<Link
								to="/artists"
								search={{ city }}
								className="inline-flex items-center transition-all hover:translate-x-1 duration-200 ease-in"
							>
								<BiChevronRight className="text-gray-800" />
								{SITE_DATA.NAME} in {city}
							</Link>
						</Text>
					))
				)}
			</Section>

			<Section gap="xs">
				<Text tag="h3">Follow us</Text>

				<Flexbox gap="sm">
					<a
						href={SITE_DATA.FACEBOOK}
						className="inline-flex justify-center items-center bg-facebook rounded-lg size-12 text-white hover:scale-105 transition-all duration-200 ease-in"
					>
						<BiLogoFacebookSquare size={32} />
					</a>
					<a
						href={SITE_DATA.INSTAGRAM}
						className="inline-flex justify-center items-center bg-instagram rounded-lg size-12 text-white hover:scale-105 transition-all duration-200 ease-in"
					>
						<BiLogoInstagram size={32} />
					</a>
				</Flexbox>
			</Section>

			<Section gap="xs">
				<Text tag="h3">Disclaimer</Text>

				<Text>
					This is a student project, and all data here is fake. If you
					want to see more of my work,{" "}
					<a
						href={SITE_DATA.AUTHOR_URL}
						target="_blank"
						rel="noreferrer noopener"
					>
						check my portfolio here
					</a>
					! You can also contact me at{" "}
					<a href={`mailto:${SITE_DATA.EMAIL}`}>{SITE_DATA.EMAIL}</a>.
				</Text>
			</Section>
		</footer>
	)
}
