import type {
	FunctionComponent,
	ChangeEvent as ChangeEv,
	FormEvent as FormEv,
	ElementType as ElType,
	RefObject as Ref,
} from "react"
import type {
	ReactChildren,
	ReactElement as ReactEl,
	DispatchState as Dispatch,
	ClassNames as Classes,
} from "@julseb-lib/react/types"

declare global {
	type FC<T = {}> = FunctionComponent<T>
	type ChangeEvent<T> = ChangeEv<T>
	type FormEvent = FormEv<HTMLFormElement>
	type ElementType = ElType
	type Children = ReactChildren
	type ReactElement = ReactEl
	type DispatchState<T> = Dispatch<T>
	type RefObject<T> = Ref<T>
	type ClassNames = Classes
}
