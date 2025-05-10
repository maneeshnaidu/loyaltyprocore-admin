"use client"

import { Transaction } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import DataTableRowActions from "@/components/data-table-row-actions"

interface TransactionColumnProps {
    onEdit: (transaction: Transaction) => void
    onDelete: (transaction: Transaction) => void
}


export const getTransactionColumns = ({ onEdit, onDelete }: TransactionColumnProps): ColumnDef<Transaction>[] => [
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
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "customer",
        header: "Customer",
    },
    {
        accessorKey: "orderNumber",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Order Number
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "points",
        header: "Points"
    },
    {
        accessorKey: "outletAddress",
        header: "Outlet"
    },
    {
        accessorKey: "transactionType",
        header: "Transaction Type"
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
        header: "Actions",
        cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />,
    },
]



