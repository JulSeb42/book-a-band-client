import { useState, useEffect } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import {
	BiChevronRight,
	BiLogoInstagram,
	BiLogoFacebookSquare,
} from "react-icons/bi"
import { Section, Text, Skeleton, Flexbox, clsx } from "@julseb-lib/react"
import { SITE_DATA } from "data"
import { userService, conversationService } from "api"
import { useAuth } from "context"
import type { Conversation } from "types"

export const Footer: FC = () => {
	const navigate = useNavigate()

	const { isLoggedIn, user } = useAuth()

	const {
		data: cities,
		isError,
		error,
		isPending,
	} = useQuery({
		queryKey: ["cities"],
		queryFn: () => userService.allCities().then(res => res.data),
	})
	const { data: admins } = useQuery({
		queryKey: ["admins"],
		queryFn: () => userService.allAdmins().then(res => res.data),
	})

	const [existingConversation, setExistingConversation] =
		useState<Conversation | null>()

	useEffect(() => {
		if (isLoggedIn && user && admins) {
			conversationService.getUserConversations(user?._id!).then(res => {
				const conversations = res.data
				const admin = admins[0]

				const conversation = conversations.find(
					c =>
						(c.user1._id === admin._id &&
							c.user2._id === user._id) ||
						(c.user1._id === user._id && c.user2._id === admin._id),
				)

				if (conversation) setExistingConversation(conversation)
				else setExistingConversation(null)
			})
		} else {
			setExistingConversation(null)
		}
	}, [])

	const handleNewConversation = () => {
		conversationService
			.newConversation({
				user1: user!._id,
				user2: admins![0]._id,
				body: "",
			})
			.then(res => {
				setTimeout(
					() =>
						navigate({
							to: "/conversation/$id",
							params: { id: res.data._id },
						}),
					200,
				)
			})
	}

	const text = "by clicking here."

	const textContact = existingConversation ? (
		<Link to="/conversation/$id" params={{ id: existingConversation._id }}>
			{text}
		</Link>
	) : (
		<button className="inline text-left" onClick={handleNewConversation}>
			{text}
		</button>
	)

	return (
		<footer
			className={clsx(
				"gap-2 grid bg-gray-200 px-[5%] py-6",
				isLoggedIn ? "grid-cols-4" : "grid-cols-3",
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

			{isLoggedIn && (
				<Section gap="xs">
					<Text tag="h3">Contact an admin</Text>

					<Text>
						If you need to talk to us, you can contact directly an
						admin {textContact}
					</Text>
				</Section>
			)}

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
