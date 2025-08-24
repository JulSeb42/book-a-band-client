import { useState } from "react"
import { createFileRoute, Link, Navigate } from "@tanstack/react-router"
import { BiUser } from "react-icons/bi"
import { Main, Aside, Text, Button, clsx } from "@julseb-lib/react"
import { ImageUploader, Page } from "components"
import { EditAccountForm, DeleteAccount, Availabilities } from "./-forms"
import { useAuth } from "context"
import { defaultUwConfig } from "data"
import type { PictureData } from "types"

const EditAccount: FC = () => {
	const { user } = useAuth()
	const [pictureData, setPictureData] = useState<PictureData>(
		user?.avatar
			? { ...defaultUwConfig, url: user.avatar }
			: (undefined as any),
	)
	const [available, setAvailable] = useState<Array<string>>(
		user?.available ? user.available : [""],
	)

	if (user?.role === "admin") return <Navigate to="/admin/edit-account" />

	return (
		<Page title="Edit your account" type="protected" noMain>
			<Aside className="flex flex-col items-center gap-2 p-0">
				<ImageUploader
					pictureData={pictureData}
					setPictureData={setPictureData}
					className={clsx("rounded-full size-40")}
					icons={{ empty: <BiUser size={80} /> }}
				/>

				<Button
					className="self-center"
					form="edit-account-form"
					type="submit"
				>
					Save changes
				</Button>

				<Button
					className="self-center"
					variant="transparent"
					element={Link}
					// @ts-expect-error
					to="/my-account"
				>
					Cancel
				</Button>
			</Aside>

			<Main className="p-0">
				<Text tag="h1">Edit your account</Text>

				<EditAccountForm
					pictureData={pictureData}
					setPictureData={setPictureData}
					available={available}
					setAvailable={setAvailable}
				/>

				<Text>
					<Link to="/my-account/edit-account/edit-password">
						Edit your password.
					</Link>
				</Text>

				<DeleteAccount />
			</Main>

			<Aside className="flex flex-col gap-2 p-0">
				<Text tag="h3">Available dates</Text>

				<Availabilities
					available={available}
					setAvailable={setAvailable}
				/>
			</Aside>
		</Page>
	)
}

export const Route = createFileRoute("/my-account/edit-account/")({
	component: EditAccount,
})
