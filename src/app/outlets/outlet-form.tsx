import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateOutlet, useUpdateOutlet } from "@/hooks/use-outlets";
import { OutletFormSchema } from "@/lib/types";
import { Outlet } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/components/providers/auth-provider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVendors } from "@/hooks/use-vendors";

type formSchema = z.infer<typeof OutletFormSchema>;

interface OutletFormProps {
    isOpen: boolean;
    outlet: Outlet | null;
    onOpenChange: (value: boolean) => void;
}

const OutletForm = ({ isOpen, outlet, onOpenChange }: OutletFormProps) => {
    const createOutletMutation = useCreateOutlet();
    const updateOutletMutation = useUpdateOutlet();
    const { user } = useAuth();
    const { data: vendors } = useVendors();

    const form = useForm<formSchema>({
        resolver: zodResolver(OutletFormSchema),
        defaultValues: {
            userName: user?.userName || "",
            vendorId: 0,
            name: "",
            description: "",
            category: "",
            address: "",
            phoneNumber: "",
            coverImage: undefined,
            isActive: true,
        },
        mode: "onChange",
    });

    const showVendorDropdown = !user?.vendor && user?.roles?.includes("SuperAdmin");

    useEffect(() => {
        if (isOpen) {
            form.reset({
                userName: user?.userName || "",
                vendorId: outlet?.vendorId || user?.vendor || 0,
                name: outlet?.name || "",
                description: outlet?.description || "",
                category: outlet?.category || "",
                address: outlet?.address || "",
                phoneNumber: outlet?.phoneNumber || "",
                isActive: outlet?.isActive ?? true,
            });
        }
    }, [form, isOpen, outlet, user]);

    const onSubmit = async (values: formSchema) => {
        if (!user) {
            toast.error("You must be logged in to perform this action.");
            return;
        }

        if (!outlet) {
            try {
                const formData = new FormData();
                Object.entries(values).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        if (key === 'coverImage') {
                            // Handle File/Blob types
                            if (value instanceof File) {
                                formData.append(key, value, (value as File).name || key);
                                return;
                            }
                        } else {
                            formData.append(key, String(value));
                        }
                    }
                });

                // Log FormData contents (for debugging)
                // for (const [key, value] of formData.entries()) {
                //     console.log(key, value);
                // }

                await createOutletMutation.mutateAsync(formData);
                toast.success("Outlet was added successfully.");
                onOpenChange(false);
            }
            catch (error) {
                console.error(error);
                toast.error("There was a problem with your request.");
            }
        } else {
            try {
                const updatedOutlet = {
                    ...outlet,
                    address: values.address,
                    isActive: values.isActive,
                };
                await updateOutletMutation.mutateAsync(updatedOutlet);
                toast.success("Outlet was updated successfully.");
                onOpenChange(false);
            } catch (error) {
                console.error(error);
                toast.error("There was a problem with your request.");
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
                    Add Outlet
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{outlet ? 'Update the outlet' : 'Create new outlet'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Vendor Dropdown */}
                        {showVendorDropdown && (
                            <FormField
                                name="vendorId"
                                control={form.control}
                                disabled={outlet != null}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vendor</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            value={field.value?.toString() ?? ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a vendor" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {vendors?.map((vendor) => (
                                                    <SelectItem
                                                        key={vendor.id}
                                                        value={vendor.id.toString()}
                                                    >
                                                        {vendor.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        {/* Name */}
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Description */}
                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Category */}
                        <FormField
                            name="category"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Address Field */}
                        <FormField
                            name="address"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123 Example Street" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Phone Number */}
                        <FormField
                            name="phoneNumber"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Cover Image */}
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
                        {/* isActive Field */}
                        {outlet ? (
                            <FormField
                                name="isActive"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Active</FormLabel>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <FormField
                                name="isActive"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="hidden">
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={true}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        )}
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={
                                    (!outlet && !form.formState.isValid) ||
                                    createOutletMutation.isPending
                                }
                            >
                                {createOutletMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {outlet ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default OutletForm;
