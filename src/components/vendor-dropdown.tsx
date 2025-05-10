// components/VendorDropdown.tsx
'use client';

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useVendors } from '@/hooks/use-vendors';
import { useEffect, useState } from 'react';

interface VendorDropdownProps {
    value: number;
    onValueChange: (vendorId: number) => void;
    className?: string;
    placeholder?: string;
}

export function VendorDropdown({
    value,
    onValueChange,
    className,
    placeholder = 'Select a vendor',
}: VendorDropdownProps) {
    const { data: vendors, isLoading, error } = useVendors();
    const [internalValue, setInternalValue] = useState<string>(onValueChange.toString())

    useEffect(() => {
        setInternalValue(value.toString())
    }, [value])

    const handleValueChange = (newValue: string) => {
        setInternalValue(newValue)
        onValueChange(Number(newValue))
    }

    if (error) {
        toast.error('Failed to load vendors', {
            description: error instanceof Error ? error.message : 'Unknown error occurred',
        });
    }

    if (isLoading) {
        return (
            <div className={className}>
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    return (
        <Select
            value={internalValue}
            onValueChange={handleValueChange}
        >
            <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {vendors?.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id.toString()}>
                        {vendor.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}