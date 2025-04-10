'use client';

import { DataTable } from './data-table';
import { columns } from './columns';
import { useVendors } from '@/hooks/use-vendors';


export default function VendorsPage() {
    const { data: vendors, isLoading, error } = useVendors();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading vendors</div>;
    if (!vendors || vendors.length === 0) {
        return <div>No vendors available</div>; // Show a message for empty data
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Vendors</h1>
            <DataTable columns={columns} data={vendors || []} />
        </div>
    );
}