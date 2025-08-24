import { Skeleton, SkeletonCard, Flexbox, clsx } from "@julseb-lib/react"

export const ArtistCardSkeleton: FC = () => {
	return (
		<SkeletonCard className={clsx("flex items-center gap-4")} isShiny>
			<Skeleton className="rounded-full size-32" />

			<div className="w-[calc(100%-128px)]">
				<Flexbox justifyContent="space-between" gap="xs">
					<Skeleton className="w-full h-[36px]" />
				</Flexbox>

				<Flexbox alignItems="end" className="mt-2">
					<Flexbox flexDirection="col" gap="xs" className="w-full">
						<Skeleton className="w-full h-[24px]" />
						<Skeleton className="w-[70%] h-[24px]" />
						<Skeleton className="w-[85%] h-[24px]" />
					</Flexbox>

					<Skeleton className="rounded-md w-[132px] h-10" />
				</Flexbox>
			</div>
		</SkeletonCard>
	)
}
