import { SkeletonCard, Skeleton } from "@julseb-lib/react"

export const ArtistCardAdminSkeleton: FC = () => {
	return (
		<SkeletonCard alignItems="center" gap="xs" isShiny>
			<Skeleton className="rounded-full size-12" />
			<Skeleton className="w-[40%] h-6" />
		</SkeletonCard>
	)
}
