"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
// import { z } from "zod";
// import { RegisterVendorFormSchema } from "@/lib/types";
import { VendorForm } from "./vendor-form";


// type VendorFormData = z.infer<typeof RegisterVendorFormSchema>;

export function VendorFormDialog() {
    const [open, setOpen] = useState(false);
    // const createVendorMutation = useCreateVendor();

    // const {
    //     register,
    //     handleSubmit,
    //     setValue,
    //     watch,
    //     formState: { errors },
    // } = useForm<VendorFormData>({
    //     resolver: zodResolver(RegisterVendorFormSchema),
    // });

    // const onSubmit = async (data: VendorFormData) => {
    //     try {
    //         await createVendorMutation.mutateAsync(data);
    //         setOpen(false); // Close dialog
    //     } catch (error) {
    //         console.error("Error adding vendor:", error);
    //     }
    // };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <PlusIcon className="h-4 w-4" />
                    <span className="hidden lg:inline ml-2">Add Vendor</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Vendor</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new vendor.
                    </DialogDescription>
                </DialogHeader>
                <VendorForm />
            </DialogContent>
        </Dialog>
    );
}