import { SkeletonCard, Skeleton, clsx } from "@julseb-lib/react"

export const MessageSkeleton: FC<IMessageSkeleton> = ({ type }) => {
	return (
		<SkeletonCard
			className={clsx(
				"flex w-full h-fit",
				type === "sender" ? "justify-end" : "justify-start",
			)}
			isShiny
		>
			<Skeleton className="w-full max-w-[70%] h-[64px]" />
		</SkeletonCard>
	)
}

interface IMessageSkeleton {
	type: "sender" | "receiver"
}
