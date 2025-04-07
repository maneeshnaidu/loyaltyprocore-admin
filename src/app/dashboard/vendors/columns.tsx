'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Vendor } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDeleteVendor } from '@/hooks/use-vendors';
import { toast } from 'sonner';

export const columns: ColumnDef<Vendor>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <div className="font-mono">{row.getValue('id')}</div>,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="px-0"
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
            <div className="line-clamp-2 max-w-[300px]">
                {row.getValue('description') || 'N/A'}
            </div>
        ),
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => (
            <div className="line-clamp-2 max-w-[300px]">
                {row.getValue('category') || 'N/A'}
            </div>
        ),
    },
    //   {
    //     accessorKey: 'price',
    //     header: () => <div className="text-right">Price</div>,
    //     cell: ({ row }) => {
    //       const price = parseFloat(row.getValue('price'));
    //       const formatted = new Intl.NumberFormat('en-US', {
    //         style: 'currency',
    //         currency: 'USD',
    //       }).format(price);

    //       return <div className="text-right font-medium">{formatted}</div>;
    //     },
    //   },
    //   {
    //     accessorKey: 'stock',
    //     header: () => <div className="text-right">Stock</div>,
    //     cell: ({ row }) => {
    //       return <div className="text-right">{row.getValue('stock')}</div>;
    //     },
    //   },
    {
        accessorKey: 'createdOn',
        header: 'Created',
        cell: ({ row }) => {
            const date = new Date(row.getValue('createdAt'));
            return date.toLocaleDateString();
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const vendor = row.original;
            const router = useRouter();
            const deleteMutation = useDeleteVendor();

            const handleDelete = async () => {
                try {
                    await deleteMutation.mutateAsync(vendor.id);
                    toast('Vendor deleted successfully', {
                        description: 'The vendor has been removed.',
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });
                } catch (error) {
                    toast('Failed to delete vendor', {
                        description: 'error',
                        action: {
                            label: "Undo",
                            onClick: () => console.log(error),
                        },
                    });
                }
            };

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
                            onClick={() => navigator.clipboard.writeText(vendor.id)}
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/vendors/${vendor.id}`} className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/vendors/${vendor.id}/edit`)}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];