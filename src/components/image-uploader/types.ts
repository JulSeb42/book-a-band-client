import type {
	ILibInputWithValidation,
	ILibInputCommon,
} from "@julseb-lib/react/component-props"
import type { defaultUwConfig } from "data"
import type { PictureData } from "types"

export type IImageUploader = Omit<
	ILibInputWithValidation,
	"children" | "value" | "counter" | "maxLength" | "hasListOpen"
> &
	ILibInputCommon & {
		uwConfig?: keyof typeof defaultUwConfig
		pictureData: PictureData
		setPictureData: DispatchState<PictureData>
		icons?: { empty?: ReactElement; hover?: ReactElement }
		className?: ClassNames
	}
