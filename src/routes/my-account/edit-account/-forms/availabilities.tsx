import { Input } from "@julseb-lib/react"
import { useAuth } from "context"

export const Availabilities: FC<IAvailabilities> = ({
	available,
	setAvailable,
}) => {
	const { user } = useAuth()

	const handleAvailable = (value: string, i: number) => {
		const newInputs = [...available]
		newInputs[i] = value

		if (i === available.length - 1 && value !== "") {
			newInputs.push("")
		}

		setAvailable(newInputs)
	}

	if (user?.role !== "artist") return null

	const availableDates = available
		.filter(date => new Date(date) >= new Date())
		.filter(date => date !== "")
		.sort((a, b) => (new Date(a) < new Date(b) ? -1 : 0))
		.map(date => {
			const split = date.split("-")
			const year = split[0]
			const month = split[1]
			let day = split[2]

			if (day.length === 1) day = "0" + day

			return `${year}-${month}-${day}`
		})

	let displayDates = availableDates
	if (
		displayDates.length === 0 ||
		displayDates[displayDates.length - 1] !== ""
	) {
		displayDates = [...displayDates, ""]
	}

	return displayDates.map((value, i) => (
		<Input
			value={value}
			onChange={e => handleAvailable(e.target.value, i)}
			type="date"
			key={i}
		/>
	))
}

interface IAvailabilities {
	available: Array<string>
	setAvailable: DispatchState<Array<string>>
}
