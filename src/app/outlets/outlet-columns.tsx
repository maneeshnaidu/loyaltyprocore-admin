"use client"

import { Outlet } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CheckCircle2Icon, LoaderIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import DataTableRowActions from "@/components/data-table-row-actions"
import { Badge } from "@/components/ui/badge"

interface OutletColumnProps {
    onEdit: (outlet: Outlet) => void
    onDelete: (outlet: Outlet) => void
}


export const getOutletColumns = ({ onEdit, onDelete }: OutletColumnProps): ColumnDef<Outlet>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "address",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Address
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
            <Badge
                variant="outline"
                className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
            >
                {row.original.isActive === true ? (
                    <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
                ) : (
                    <LoaderIcon />
                )}
                {row.original.isActive === true ? "Active" : "Inactive"}
            </Badge>
        ),
    },
    {
        accessorKey: "createdOn",
        header: () => <div className="text-right">Created On</div>,
        cell: ({ row }) => {
            const createdOn = row.getValue("createdOn") as string | number | Date;
            const formatted = new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            }).format(new Date(createdOn));

            return <div className="text-right font-medium">{formatted}</div>

        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />,
    },
]

// const handleToggleActive = async (id: string) => {
//     try {
//         // Call your API to toggle the active state
//         await apiClient.patch(`/outlets/${id}/toggle-active`);

//         console.log(`Vendor ${id} active state toggled successfully.`);
//     } catch (error) {
//         console.error("Failed to toggle vendor status:", error);
//     }
// };

