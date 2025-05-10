// components/ui/data-table-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

interface DataTableSkeletonProps {
    columns: number
    rows?: number
}

export function DataTableSkeleton({
    columns,
    rows = 5,
}: DataTableSkeletonProps) {
    return (
        <div className="space-y-4">
            {/* Header Skeleton */}
            <div className="flex space-x-4">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={`header-${i}`} className="h-10 w-full" />
                ))}
            </div>

            {/* Row Skeletons */}
            <div className="space-y-2">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="flex space-x-4">
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <Skeleton
                                key={`cell-${rowIndex}-${colIndex}`}
                                className="h-8 w-full"
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}