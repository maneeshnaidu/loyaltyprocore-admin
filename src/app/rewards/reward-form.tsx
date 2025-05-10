import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RewardFormSchema } from "@/lib/types";
import { Reward } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/components/providers/auth-provider";
import { Switch } from "@/components/ui/switch";
import { useCreateReward, useUpdateReward } from "@/hooks/use-rewards";
import RoleBasedRender from "@/components/role-based-render";
import { VendorDropdown } from "@/components/vendor-dropdown";

type formSchema = z.infer<typeof RewardFormSchema>;

interface RewardFormProps {
    isOpen: boolean;
    reward: Reward | null;
    onOpenChange: (value: boolean) => void;
}

const RewardForm = ({ isOpen, reward, onOpenChange }: RewardFormProps) => {
    const createRewardMutation = useCreateReward();
    const updateRewardMutation = useUpdateReward();
    const { user } = useAuth();

    const form = useForm<formSchema>({
        resolver: zodResolver(RewardFormSchema),
        defaultValues: {
            vendor: user?.vendor || reward?.vendorId,
            title: reward?.title || "",
            description: reward?.description || "",
            pointsRequired: reward?.pointsRequired || 10,
            isActive: reward?.isActive || true
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (isOpen) {
            form.reset({
                vendor: user?.vendor || reward?.vendorId,
                title: reward?.title || "",
                description: reward?.description || "",
                pointsRequired: reward?.pointsRequired || 10,
                isActive: reward?.isActive || true
            });
        }
    }, [form, isOpen, reward, user?.vendor]);

    const onSubmit = async (values: formSchema) => {
        if (!user) {
            toast.error("You must be logged in to perform this action.");
            return;
        }

        if (!reward) {
            try {
                const createValues = values as formSchema;
                const newReward = {
                    vendorId: user.vendor ? user.vendor : createValues.vendor,
                    title: createValues.title,
                    description: createValues.description,
                    pointsRequired: createValues.pointsRequired,
                    isActive: createValues.isActive
                }

                await createRewardMutation.mutateAsync({
                    id: newReward.vendorId,
                    data: newReward
                });
                toast.success("Reward was added successfully.");
                onOpenChange(false);
            }
            catch (error) {
                console.error(error);
                toast.error("There was a problem with your request.");
            }
        } else {
            try {
                const updatedReward = {
                    ...reward,
                    title: values.title,
                    description: values.description,
                    pointsRequired: values.pointsRequired,
                    isActive: values.isActive,
                };
                await updateRewardMutation.mutateAsync(updatedReward);
                toast.success("Reward was updated successfully.");
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
                    Add Reward
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{reward ? 'Update the reward' : 'Create new reward'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Vendor Field - Only visible to SuperAdmin users */}
                        <RoleBasedRender allowedRoles={['SuperAdmin']}>
                            {!reward && (
                                <FormField
                                    name="vendor"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Vendor</FormLabel>
                                            <FormControl>
                                                <VendorDropdown
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </RoleBasedRender>
                        {/* Address Field */}
                        <FormField
                            name="title"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Basic Reward" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Address Field */}
                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Reward description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Address Field */}
                        <FormField
                            name="pointsRequired"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Required Points</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber || 10)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* isActive Field */}
                        <FormField
                            name="isActive"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
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
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={
                                    (!reward && !form.formState.isValid) ||
                                    createRewardMutation.isPending ||
                                    updateRewardMutation.isPending
                                }
                            >
                                {createRewardMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default RewardForm;
