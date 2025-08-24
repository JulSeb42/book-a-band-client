import { createContext, useContext, useState } from "react"
import type { IModalOpenContext } from "./type"

const ModalOpenContext = createContext<IModalOpenContext>(null as any)

export const ModalOpenProviderWrapper = ({
	children,
}: {
	children: Children
}) => {
	const [hasModalOpen, setHasModalOpen] = useState(false)

	return (
		<ModalOpenContext.Provider value={{ hasModalOpen, setHasModalOpen }}>
			{children}
		</ModalOpenContext.Provider>
	)
}

export const useModalOpen = () =>
	useContext(ModalOpenContext) as IModalOpenContext
