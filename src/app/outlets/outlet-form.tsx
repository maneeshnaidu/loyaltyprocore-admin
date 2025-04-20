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

    const form = useForm<formSchema>({
        resolver: zodResolver(OutletFormSchema),
        defaultValues: {
            address: outlet?.address || "",
            userName: user?.userName || "",
            isActive: outlet?.isActive,
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (outlet) {
            form.reset({
                address: outlet.address,
                userName: user?.userName || "",
                isActive: outlet.isActive,
            });
        } else {
            form.reset();
        }
    }, [form, isOpen, outlet, user?.userName]);

    const onSubmit = async (values: formSchema) => {
        if (!user) {
            toast.error("You must be logged in to perform this action.");
            return;
        }

        if (!outlet) {
            try {
                const formData = new FormData();
                formData.append("address", values.address);
                formData.append("userName", values.userName);
                formData.append("isActive", values.isActive.toString());
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
                    userName: values.userName,
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
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Outlet
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{outlet ? 'Update the outlet' : 'Create new outlet'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        {/* Hidden Username Field */}
                        <FormField
                            name="userName"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="hidden">
                                    <FormControl>
                                        <Input type="hidden" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
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
                                disabled={!form.formState.isValid || createOutletMutation.isPending}
                            >
                                {createOutletMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default OutletForm;
