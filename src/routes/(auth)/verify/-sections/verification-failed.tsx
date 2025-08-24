import { Text } from "@julseb-lib/react"
import { Page, ErrorMessage } from "components"
import type { IErrorMessage } from "types"

export const VerificationFailed: FC<IVerificationFailed> = ({
	errorMessage,
}) => {
	return (
		<Page title="Verify your account" type="protected">
			<Text tag="h1">Verification failed</Text>

			<Text>
				Your account could not be verified, please try again later.
			</Text>

			<ErrorMessage>{errorMessage}</ErrorMessage>
		</Page>
	)
}

interface IVerificationFailed {
	errorMessage: IErrorMessage
}
