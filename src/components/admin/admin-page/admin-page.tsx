import { clsx, Meta, PageLoading, Main } from "@julseb-lib/react"
import { AdminNav } from "../admin-nav"
import type { IAdminPage } from "./types"
import { SITE_DATA } from "data"

export const AdminPage: FC<IAdminPage> = ({
	title,
	children,
	isLoading,
	mainSize = "default",
}) => {
	return (
		<>
			<Meta
				title={`${title} | ${SITE_DATA.NAME}`}
				favicon={SITE_DATA.FAVICON}
			/>

			{isLoading ? (
				<PageLoading />
			) : (
				<section
					className={clsx("pl-(--admin-nav-width)", "admin-page")}
				>
					<AdminNav />

					<Main
						className="mx-auto w-[calc(100%-var(--admin-nav-width))]"
						size={mainSize}
					>
						{children}
					</Main>
				</section>
			)}
		</>
	)
}
