import { Skeleton, Text, Flexbox } from "@julseb-lib/react"
import { Page } from "components"

export const VerificationSkeleton: FC = () => {
	return (
		<Page title="Loading..." type="none">
			<Text tag="h1">Verify your account</Text>

			<Flexbox flexDirection="col" gap="sm">
				<Skeleton className="rounded-md w-full h-6" animation="shine" />
				<Skeleton
					className="rounded-md w-[80%] h-6"
					animation="shine"
				/>
			</Flexbox>
		</Page>
	)
}
