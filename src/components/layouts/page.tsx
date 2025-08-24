import { Fragment, useState, useEffect } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { BiSearch } from "react-icons/bi"
import { PageLayout, clsx, Meta, PageLoading, Image } from "@julseb-lib/react"
import {
	noneLinks,
	anonLinks,
	protectedLinks,
	adminLinks,
	SITE_DATA,
	type NavLink,
} from "data"
import { useAuth } from "context"
import { ProtectedRoute } from "components/routes/protected-route"
import { AnonRoute } from "components/routes/anon-route"
import { AdminRoute } from "components/routes/admin-route"
import { Footer } from "./footer"
import type { ILibPageLayout } from "@julseb-lib/react/component-props"
import type { LinkType } from "types"
import type { LibMainSize } from "@julseb-lib/react/types"

export const Page: FC<IPage> = ({
	title,
	description,
	keywords = [],
	cover,
	children,
	noWrapper,
	noMain,
	isLoading,
	mainSize,
	type,
	noHeader,
	noFooter,
	...rest
}) => {
	const navigate = useNavigate()

	const [search, setSearch] = useState("")

	const Element =
		type === "anon"
			? AnonRoute
			: type === "admin"
				? AdminRoute
				: type === "protected"
					? ProtectedRoute
					: Fragment

	const pageTitle = `${title} | ${SITE_DATA.NAME}`

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		navigate({ to: "/artists", search: { search } })
	}

	if (isLoading) {
		return (
			<>
				<Meta title={pageTitle} />
				<PageLoading loaderVariant={3} />
			</>
		)
	}

	return (
		<Element>
			<PageLayout
				meta={{
					title: pageTitle,
					description: description ?? SITE_DATA.DESCRIPTION,
					keywords: [...keywords, ...SITE_DATA.KEYWORDS],
					cover: cover ?? SITE_DATA.COVER,
					favicon: SITE_DATA.FAVICON,
					siteName: SITE_DATA.NAME,
					author: SITE_DATA.AUTHOR,
					authorUrl: SITE_DATA.AUTHOR_URL,
					language: SITE_DATA.LANGUAGE,
					type: SITE_DATA.TYPE as any,
					url: SITE_DATA.URL,
					generator: SITE_DATA.GENERATOR,
					publisher: SITE_DATA.AUTHOR,
					email: SITE_DATA.EMAIL,
					creator: SITE_DATA.AUTHOR,
					manifest: SITE_DATA.MANIFEST,
					category: SITE_DATA.CATEGORY,
					twitterCard: SITE_DATA.TWITTER_CARD as any,
					appleTouchIcon: "/logo192.png",
					themeColor: "#142f43",
				}}
				header={
					!noHeader ? (
						{
							logo: (
								<Link to="/">
									<Image
										src="/images/logo-white.svg"
										alt="Book a Band logo"
										width={40}
									/>
								</Link>
							),
							nav: <Nav />,
							position: "absolute",
							className: clsx(
								"md:[&_.header-burger]:hidden! z-10 md:[&_nav]:relative md:[&_nav]:flex-row [&_nav]:flex-col [&_nav]:p-0 [&_nav]:w-[70%] md:[&_nav]:w-fit",
							),
							search: {
								value: search,
								setValue: setSearch,
								clearSearch: () => setSearch(""),
								placeholder: "Search city, genre, or name...",
								focusKeys: ["Command", "KeyK"],
								showKeys: true,
								iconLeft: <BiSearch />,
								handleSubmit,
							},
						}
					) : (
						<></>
					)
				}
				noMain={noMain as any}
				noWrapper={noWrapper as any}
				wrapperProps={{
					className: clsx(
						"flex-row mt-[72px] pt-8 pb-12 min-h-[calc(100svh-72px-64px)]",
					),
					...rest.wrapperProps,
				}}
				mainProps={{ className: "py-0", size: mainSize }}
				footer={!noFooter ? <Footer /> : <></>}
				{...rest}
			>
				{children}
			</PageLayout>
		</Element>
	)
}

const Nav: FC = () => {
	const navigate = useNavigate()

	const { isLoggedIn, user, logoutUser } = useAuth()

	const [allLinks, setAllLinks] = useState<Array<NavLink>>([])

	useEffect(() => {
		if (isLoggedIn) {
			if (user?.role === "admin") {
				setAllLinks([...noneLinks, ...adminLinks])
			} else {
				setAllLinks([...noneLinks, ...protectedLinks])
			}
		} else {
			setAllLinks([...noneLinks, ...anonLinks])
		}
	}, [isLoggedIn, user?.role])

	return (
		<>
			{allLinks.map((link, i) => (
				<Link
					to={link.to}
					className={clsx(
						"relative",
						"before:w-0 before:h-0.5 before:bg-white before:absolute before:bottom-0 before:left-[50%] before:transition-all before:ease-in before:duration-200",
						"hover:before:w-full hover:before:left-0",
					)}
					key={i}
				>
					{link.text}
				</Link>
			))}

			{isLoggedIn && (
				<button
					onClick={() => {
						logoutUser()
						navigate({ to: "/login" })
					}}
					className={clsx(
						"relative text-left",
						"before:w-0 before:h-0.5 before:bg-white before:absolute before:bottom-0 before:left-[50%] before:transition-all before:ease-in before:duration-200",
						"hover:before:w-full hover:before:left-0",
					)}
				>
					Logout
				</button>
			)}
		</>
	)
}

type IPage = ILibPageLayout & {
	title: string
	description?: string
	keywords?: Array<string>
	cover?: string
	isLoading?: boolean
	type: LinkType
	mainSize?: LibMainSize
	noHeader?: boolean
	noFooter?: boolean
	searchTerms?: string
}
