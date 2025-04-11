"use client"

import { Vendor } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "../ui/switch"
import apiClient from "@/lib/api-client"

export const columns: ColumnDef<Vendor>[] = [
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
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
            const vendor = row.original;
            return (
                <Switch
                    checked={vendor.isActive}
                    onCheckedChange={(value) => handleToggleActive(vendor.id, value)}
                />
            );
        }
    },
    // {
    //     accessorKey: "coverImageUrl",
    //     header: "Cover Image",
    // },
    // {
    //     accessorKey: "logoImageUrl",
    //     header: "Logo Image",
    // },
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
    // {
    //     accessorKey: "outlets",
    //     header: "Outlets",
    // },
    {
        id: "actions",
        cell: ({ row }) => {
            const model = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(model.id)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
        // Call your API to update the isActive state
        await apiClient.patch(`/vendors/${id}`, { isActive });
        console.log(`Vendor ${id} is now ${isActive ? "active" : "inactive"}`);
    } catch (error) {
        console.error("Failed to update vendor status:", error);
    }
};

