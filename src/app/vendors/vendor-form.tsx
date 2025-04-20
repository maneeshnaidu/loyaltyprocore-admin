import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateVendor, useUpdateVendor } from "@/hooks/use-vendors";
import { RegisterVendorFormSchema, UpdateVendorSchema } from "@/lib/types";
import { UpdateVendorRequestDto, Vendor } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type createFormSchema = z.infer<typeof RegisterVendorFormSchema>;
type updateFormSchema = z.infer<typeof UpdateVendorSchema>;
type formSchema = createFormSchema | updateFormSchema;

interface VendorFormProps {
    isOpen: boolean;
    vendor: Vendor | null;
    onOpenChange: (value: boolean) => void;
}

const VendorForm = ({ isOpen, vendor, onOpenChange }: VendorFormProps) => {
    const createVendorMutation = useCreateVendor();
    const updateVendorMutation = useUpdateVendor();
    const form = useForm<formSchema>({
        resolver: zodResolver(vendor ? UpdateVendorSchema : RegisterVendorFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            name: "",
            description: "",
            category: "",
            logoImage: undefined,
            coverImage: undefined,
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (isOpen) {
            if (vendor) {
                form.reset({
                    name: vendor.name || "",
                    description: vendor.description || "",
                    category: vendor.category || "",
                    logoImage: undefined,
                    coverImage: undefined,
                });
            } else {
                form.reset({
                    firstName: "",
                    lastName: "",
                    username: "",
                    email: "",
                    password: "",
                    name: "",
                    description: "",
                    category: "",
                    logoImage: undefined,
                    coverImage: undefined,
                });
            }
        }
    }, [form, isOpen, vendor]);

    const onSubmit = async (values: formSchema) => {
        console.log(vendor);
        if (!vendor) {
            try {
                const formData = new FormData();
                // formData.append("firstName", values.firstName);
                // formData.append("lastName", values.lastName);
                // formData.append("username", values.username);
                // formData.append("email", values.email);
                // formData.append("password", values.password);
                // formData.append("name", values.name);
                // formData.append("description", values.description);
                // formData.append("category", values.category);
                // if (values.logoImage) {
                //     formData.append("logoImage", values.logoImage);
                // }
                // if (values.coverImage) {
                //     formData.append("coverImage", values.coverImage);
                // }
                // await createVendorMutation.mutateAsync(formData);
                // toast.success("Vendor was added successfully.");
                // onOpenChange(false);
                // Append all values
                Object.entries(values).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        if (key === 'logoImage' || key === 'coverImage') {
                            if (value) formData.append(key, value);
                        } else {
                            formData.append(key, value);
                        }
                    }
                });

                // Log FormData contents (for debugging)
                for (const [key, value] of formData.entries()) {
                    console.log(key, value);
                }

                try {
                    await createVendorMutation.mutateAsync(formData);
                    toast.success("Vendor was added successfully.");
                    onOpenChange(false);
                } catch (error) {
                    console.error('Submission error:', error);
                    toast.error("There was a problem with your request.");
                }
            }
            catch (error) {
                console.error(error);
                toast.error("There was a problem with your request.");
            }
        } else {
            // try {
            // const formData = new FormData();
            // formData.append("id", vendor.id); // Make sure to include the ID
            // formData.append("name", values.name);
            // formData.append("description", values.description || "");
            // formData.append("category", values.category);
            // if (values.logoImage) {
            //     formData.append("logoImage", values.logoImage);
            // }
            // if (values.coverImage) {
            //     formData.append("coverImage", values.coverImage);
            // }
            // await updateVendorMutation.mutateAsync(formData);
            // toast.success("Vendor was updated successfully.");
            // onOpenChange(false);

            // } catch (error) {
            //     console.error(error);
            //     toast.error("There was a problem with your request.");
            // }
            try {
                const updateData: UpdateVendorRequestDto = {
                    name: values.name,
                    description: values.description,
                    category: values.category,
                    // Add other fields your backend expects
                };

                await updateVendorMutation.mutateAsync({
                    id: vendor.id, // Pass the ID from the vendor prop
                    data: updateData,
                });

                toast.success("Vendor updated successfully");
                onOpenChange(false);
            } catch (error) {
                console.error(error);
                toast.error("Failed to update vendor");
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            onOpenChange(open);
            if (!open) form.reset();
        }}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Vendor
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{vendor ? 'Update the vendor' : 'Create new vendor'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Only show personal info fields when creating */}
                        {!vendor && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        name="firstName"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="lastName"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        name="username"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="johndoe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="email"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="john@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    name="password"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="********" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Acme Inc." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Company description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="category"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Restaurant" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                name="logoImage"
                                control={form.control}
                                render={({ field }) => {
                                    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                                        const file = event.target.files?.[0];
                                        field.onChange(file);
                                    };

                                    return (
                                        <FormItem>
                                            <FormLabel>Logo Image</FormLabel>
                                            <FormControl>
                                                <Input type="file"
                                                    onChange={handleFileChange}
                                                    ref={field.ref}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                name="coverImage"
                                control={form.control}
                                render={({ field }) => {
                                    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                                        const file = event.target.files?.[0];
                                        field.onChange(file);
                                    };

                                    return (
                                        <FormItem>
                                            <FormLabel>Cover Image</FormLabel>
                                            <FormControl>
                                                <Input type="file"
                                                    onChange={handleFileChange}
                                                    ref={field.ref}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={
                                    (!vendor && !form.formState.isValid) ||
                                    createVendorMutation.isPending ||
                                    updateVendorMutation.isPending
                                }
                            >
                                {(createVendorMutation.isPending || updateVendorMutation.isPending) && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {vendor ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default VendorForm; 