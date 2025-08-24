import { SkeletonCard, Skeleton, Flexbox } from "@julseb-lib/react"

export const ConversationCardSkeleton: FC = () => {
	return (
		<SkeletonCard className="flex gap-2" isShiny>
			<Skeleton className="rounded-full size-12" />

			<Flexbox
				flexDirection="col"
				className="w-[calc(100%-48px)]"
				gap="xs"
			>
				<Skeleton className="w-[70%] h-[27px]" />
				<Skeleton className="w-[90%] h-[24px]" />
				<Skeleton className="w-[30%] h-[21px]" />
			</Flexbox>
		</SkeletonCard>
	)
}
