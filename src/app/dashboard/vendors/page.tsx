'use client';

import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import { useVendors } from '@/hooks/use-vendors';

export default function VendorsPage() {
    const { data: vendors, isLoading, error } = useVendors();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading vendors</div>;

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Vendors</h1>
            <DataTable columns={columns} data={vendors || []} />
        </div>
    );
}