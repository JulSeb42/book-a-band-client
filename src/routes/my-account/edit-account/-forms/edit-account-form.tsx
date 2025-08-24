import { useState, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import {
	Form,
	Input,
	Autocomplete,
	MarkdownEditor,
	Text,
	toast,
} from "@julseb-lib/react"
import { ErrorMessage } from "components"
import { userService } from "api"
import { useAuth } from "context"
import { COMMON_TEXTS, GERMAN_CITIES } from "data"
import type { LibValidationStatus } from "@julseb-lib/react/types"
import type { PictureData } from "types"

export const EditAccountForm: FC<IEditAccountForm> = ({
	pictureData,
	setPictureData,
	available,
	setAvailable,
}) => {
	const navigate = useNavigate()
	const { user, setUser, setToken } = useAuth()

	const [inputs, setInputs] = useState({
		fullName: user?.fullName ?? "",
		genre: user?.genre ?? "",
		price: user?.price ?? 0,
		youtubeUrl: user?.youtubeUrl ?? "",
		facebookUrl: user?.facebookUrl ?? "",
		instagramUrl: user?.instagramUrl ?? "",
		slug: user?.slug ?? "",
	})
	const [bio, setBio] = useState(user?.bio ?? "")
	const [city, setCity] = useState(user?.city ?? "")
	const [youtubeLinks, setYoutubeLinks] = useState<Array<string>>(
		user?.youtubeLinks ?? [""],
	)
	const [validation, setValidation] = useState<{
		fullName: LibValidationStatus
		city: LibValidationStatus
		genre: LibValidationStatus
		price: LibValidationStatus
		slug: LibValidationStatus
	}>({
		fullName: undefined,
		city: undefined,
		genre: undefined,
		price: undefined,
		slug: undefined,
	})
	const [errorMessage, setErrorMessage] = useState(undefined)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (user) {
			setInputs({
				fullName: user.fullName,
				genre: user.genre,
				price: user.price,
				youtubeUrl: user.youtubeUrl,
				facebookUrl: user.facebookUrl,
				instagramUrl: user.instagramUrl,
				slug: user.slug,
			})
			setCity(user.city)
			setBio(user.bio)
			setYoutubeLinks(
				user.youtubeLinks && user.youtubeLinks.length > 0
					? user.youtubeLinks
					: [""],
			)
			setPictureData({ ...pictureData, url: user.avatar ?? "" })
			setAvailable(user.available ? user.available : [""])
			setIsLoading(false)
		}
	}, [user])

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target

		setInputs({ ...inputs, [id]: value })

		if (
			validation.fullName ||
			validation.city ||
			validation.genre ||
			validation.price ||
			validation.slug
		) {
			setValidation({
				fullName: value.length ? false : true,
				city: value.length ? false : true,
				genre: value.length ? false : true,
				price: value.length ? false : true,
				slug: value.length ? false : true,
			})
		}
	}

	const handleYoutubeLinks = (value: string, i: number) => {
		const newInputs = [...youtubeLinks]
		newInputs[i] = value

		if (i === youtubeLinks.length - 1 && value !== "") {
			newInputs.push("")
		}

		setYoutubeLinks(newInputs)
	}

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		setIsLoading(true)

		if (
			!inputs.fullName?.length ||
			!city.length ||
			!inputs.genre.length ||
			!inputs.price.toString().length ||
			!inputs.slug.length
		) {
			setValidation({
				...validation,
				fullName: !inputs.fullName?.length ? false : undefined,
				city: !city.length ? false : undefined,
				genre: !inputs.genre.length ? false : undefined,
				price: !inputs.price.toString().length ? false : undefined,
				slug: !inputs.slug.length ? false : undefined,
			})
			return
		}

		userService
			.editAccount(user!._id, {
				...inputs,
				avatar: pictureData?.url ?? "",
				bio,
				city,
				youtubeLinks: youtubeLinks.filter(link => link !== ""),
				available,
			})
			.then(res => {
				setUser(res.data.user)
				setToken(res.data.authToken)
				toast.success("Your changes have been saved!")
			})
			.then(() => setTimeout(() => navigate({ to: "/my-account" }), 300))
			.catch(err => setErrorMessage(err.response.data.message))
			.finally(() => setIsLoading(false))
	}

	return (
		<>
			<Form
				onSubmit={handleSubmit}
				isLoading={isLoading}
				id="edit-account-form"
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
					value={user?.email}
					disabled
					aria-disabled
					helperBottom="You can not edit your email."
				/>

				<Autocomplete
					id="city"
					label="City"
					value={city}
					setValue={setCity}
					listResults={GERMAN_CITIES}
				/>

				{user?.role === "artist" && (
					<>
						<Input
							id="genre"
							label="Genre"
							value={inputs.genre}
							onChange={handleChange}
						/>
						<Input
							id="price"
							type="number"
							label="Price"
							value={inputs.price}
							onChange={handleChange}
						/>

						<Input
							id="youtubeUrl"
							label="Youtube URL"
							value={inputs.youtubeUrl}
							onChange={handleChange}
						/>

						<Input
							id="facebookUrl"
							label="Facebok URL"
							value={inputs.facebookUrl}
							onChange={handleChange}
						/>

						<Input
							id="instagramUrl"
							label="Instagram URL"
							value={inputs.instagramUrl}
							onChange={handleChange}
						/>

						<Input
							id="slug"
							label="Slug"
							value={inputs.slug}
							onChange={handleChange}
						/>

						{youtubeLinks.map((value, i) => (
							<Input
								label="Youtube link"
								value={value}
								onChange={e =>
									handleYoutubeLinks(e.target.value, i)
								}
								key={i}
							/>
						))}

						<MarkdownEditor
							id="bio"
							label="Bio"
							value={bio}
							setValue={setBio}
							options={{
								titles: false,
								code: false,
								codeBlock: false,
								comment: false,
								image: false,
								quote: false,
								viewCode: true,
								viewLive: true,
								viewPreview: true,
							}}
							helperBottom={
								<Text tag="small">
									Write in markdown,{" "}
									<a
										href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"
										target="_blank"
										rel="noreferrer noopener"
									>
										check here for the syntax!
									</a>
								</Text>
							}
						/>
					</>
				)}
			</Form>

			<ErrorMessage>{errorMessage}</ErrorMessage>
		</>
	)
}

interface IEditAccountForm {
	pictureData: PictureData
	setPictureData: DispatchState<PictureData>
	available: Array<string>
	setAvailable: DispatchState<Array<string>>
}
