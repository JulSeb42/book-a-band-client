import type { AxiosError } from "axios"

export type IError<T> = AxiosError<T> | undefined
export type IErrorMessage = IError<{ message: string }> | string | Array<string>
