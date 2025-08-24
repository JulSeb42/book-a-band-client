import { InputContainer, Skeleton, clsx, stringifyPx } from "@julseb-lib/react"
import type { IInputSkeleton } from "./types"

export const InputSkeleton: FC<IInputSkeleton> = ({
	label,
	width = "100%",
}) => {
	return (
		<InputContainer label={label} className={clsx("", "input-skeleton")}>
			<Skeleton
				className="h-8 w-(--skeleton-width)"
				style={{ ["--skeleton-width" as any]: stringifyPx(width) }}
				animation="shine"
			/>
		</InputContainer>
	)
}
