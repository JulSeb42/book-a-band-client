import { useState } from "react"
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi"
import { useNavigate } from "@tanstack/react-router"
import {
	Pagination as Container,
	PaginationButton,
	clsx,
} from "@julseb-lib/react"
import type { IPagination } from "./types"

const LIMIT = 10

export const Pagination: FC<IPagination> = ({ currentPage, totalPages }) => {
	const navigate = useNavigate()

	const [page, setPage] = useState(currentPage)

	const handlePrev = () => {
		navigate({ to: ".", search: { page: page - 1 } })
		setPage(prev => prev - 1)
	}

	const handlePage = (n: number) => {
		navigate({ to: ".", search: { page: n } })
		setPage(n)
	}

	const handleNext = () => {
		navigate({ to: ".", search: { page: page + 1 } })
		setPage(prev => prev + 1)
	}

	const getPaginationGroup = () => {
		const start = Math.floor((currentPage! - 1) / LIMIT) * LIMIT

		return new Array(LIMIT)
			.fill(totalPages)
			.map((_, i) => start + i + 1)
			.filter(item => item <= (totalPages || 0))
	}

	const paginationGroup = getPaginationGroup()

	if (totalPages <= 1) return null

	return (
		<Container className={clsx("", "pagination")}>
			<PaginationButton
				onClick={handlePrev}
				disabled={page === 1}
				isActive={false}
			>
				<BiLeftArrowAlt size={24} />
			</PaginationButton>

			{paginationGroup[0] !== 1 && (
				<>
					<PaginationButton
						isActive={currentPage === 1}
						onClick={() => handlePage(1)}
					>
						1
					</PaginationButton>

					<PaginationButton readOnly>...</PaginationButton>
				</>
			)}

			{paginationGroup.map(n => (
				<PaginationButton
					isActive={n === currentPage}
					onClick={() => handlePage(n)}
					key={n}
				>
					{n}
				</PaginationButton>
			))}

			{paginationGroup[paginationGroup.length - 1] !== totalPages && (
				<>
					<PaginationButton readOnly>...</PaginationButton>

					<PaginationButton
						isActive={currentPage === totalPages}
						onClick={() => handlePage(totalPages)}
					>
						{totalPages}
					</PaginationButton>
				</>
			)}

			<PaginationButton
				onClick={handleNext}
				isActive={false}
				disabled={currentPage === totalPages}
			>
				<BiRightArrowAlt size={24} />
			</PaginationButton>
		</Container>
	)
}
