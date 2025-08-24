import { useState, useEffect } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Text, Form, Input, toast } from "@julseb-lib/react"
import { AdminPage, ImageUploader, ErrorMessage } from "components"
import { useAuth } from "context"
import { userService } from "api"
import { COMMON_TEXTS, defaultUwConfig } from "data"
import type { LibValidationStatus } from "@julseb-lib/react/types"
import type { PictureData } from "types"

const EditAccount: FC = () => {
	const { user, setUser, setToken } = useAuth()

	const [inputs, setInputs] = useState({
		fullName: user?.fullName ?? "",
	})
	const [pictureData, setPictureData] = useState<PictureData>(
		user?.avatar
			? { ...defaultUwConfig, url: user.avatar }
			: (undefined as any),
	)
	const [validation, setValidation] = useState<{
		fullName: LibValidationStatus
	}>({
		fullName: undefined,
	})
	const [errorMessage, setErrorMessage] = useState(undefined)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (user) {
			setInputs({ fullName: user.fullName })
			setPictureData({ ...pictureData, url: user.avatar })
			setIsLoading(false)
		}
	}, [user])

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target

		setInputs({ ...inputs, [id]: value })

		if (validation.fullName) {
			setValidation({
				fullName: value.length ? false : true,
			})
		}
	}

	const handleReset = () => {
		setInputs({ fullName: user!.fullName })
		setPictureData({ ...defaultUwConfig, url: user!.avatar ?? "" })
	}

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		setIsLoading(true)

		if (!inputs.fullName?.length) {
			setValidation({
				...validation,
				fullName: !inputs.fullName?.length ? false : undefined,
			})
			return
		}

		userService
			.editAccount(user!._id, {
				...inputs,
				avatar: pictureData?.url ?? "",
			})
			.then(res => {
				setUser(res.data.user)
				setToken(res.data.authToken)
				toast.success("Your changes have been saved!")
			})
			.catch(err => setErrorMessage(err.response.data.message))
			.finally(() => setIsLoading(false))
	}

	return (
		<AdminPage title="Edit Account" mainSize="form">
			<Text tag="h1">Edit Account</Text>

			<Form
				buttonPrimary="Save"
				buttonSecondary={{ content: "Cancel", onClick: handleReset }}
				onSubmit={handleSubmit}
				isLoading={isLoading}
			>
				<Input
					id="fullName"
					label="Full name"
					value={inputs.fullName}
					onChange={handleChange}
					validation={{
						status: validation.fullName,
						message: COMMON_TEXTS.ERRORS.FULL_NAME_EMPTY,
					}}
				/>

				<Input
					id="email"
					label="Email"
					value={user?.email ?? ""}
					disabled
					aria-disabled
					helperBottom="You can not edit your email."
				/>

				<ImageUploader
					pictureData={pictureData}
					setPictureData={setPictureData}
					label="Avatar"
				/>
			</Form>

			<ErrorMessage>{errorMessage}</ErrorMessage>

			<Text>
				<Link to="/admin/edit-account/edit-password">
					Edit your password.
				</Link>
			</Text>
		</AdminPage>
	)
}

export const Route = createFileRoute("/admin/edit-account/")({
	component: EditAccount,
})
