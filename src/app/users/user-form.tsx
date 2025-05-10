import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterFormSchema, UpdateUserFormSchema } from "@/lib/types";
import { UpdateUserRequestDto, UserModel } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/components/providers/auth-provider";
import { useVendors } from "@/hooks/use-vendors";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useUpdateUser } from "@/lib/user-service";

type createFormSchema = z.infer<typeof RegisterFormSchema>;
type updateFormSchema = z.infer<typeof UpdateUserFormSchema>;
type formSchema = createFormSchema | updateFormSchema;

interface UserFormProps {
    isOpen: boolean;
    userModel: UserModel | null;
    onOpenChange: (value: boolean) => void;
}

const UserForm = ({ isOpen, userModel, onOpenChange }: UserFormProps) => {
    const { user, registerUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { data: vendors } = useVendors();

    const updateUserMutation = useUpdateUser();

    const form = useForm<formSchema>({
        resolver: zodResolver(userModel ? UpdateUserFormSchema : RegisterFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            vendorId: 0,
            roles: ""
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (isOpen) {
            if (userModel) {
                form.reset({
                    firstName: userModel.firstName || "",
                    lastName: userModel.lastName || "",
                    email: userModel.email || "",
                    username: userModel.userName || "",
                    vendorId: userModel.vendorId ?? user?.vendor ?? 0,
                    roles: userModel.roles?.join(",") || ""
                });
            } else {
                form.reset({
                    firstName: "",
                    lastName: "",
                    email: "",
                    username: "",
                    password: "",
                    confirmPassword: "",
                    vendorId: user?.vendor ?? 0,
                    roles: ""
                });
            }
        }
    }, [form, isOpen, user?.vendor, userModel]);

    const showVendorDropdown = !user?.vendor && user?.roles?.includes("SuperAdmin");
    const roleOptions = ["Admin", "Staff"];

    const onSubmit = async (values: formSchema) => {
        setError("");
        setIsLoading(true);

        if (!user) {
            toast.error("You must be logged in to perform this action.");
            setIsLoading(false);
            return;
        }

        if (!userModel) {
            try {
                // Type assertion for create operation
                const createValues = values as createFormSchema;
                const newUser = {
                    firstName: createValues.firstName,
                    lastName: createValues.lastName,
                    userName: createValues.username,
                    email: createValues.email,
                    password: createValues.password,
                    vendorId: showVendorDropdown ? createValues.vendorId ?? 0 : user.vendor,
                    roles: createValues.roles ? createValues.roles : ""
                };

                await registerUser(newUser);
                toast.success(userModel ? "User updated successfully." : "User was added successfully.");
                onOpenChange(false);
            } catch (err) {
                setError('Error: ' + err);
                toast.error("There was a problem with your request.");
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                const updateData: UpdateUserRequestDto = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    userName: values.username,
                    email: values.email,
                    vendorId: values.vendorId ?? 0,
                    roles: values.roles
                };

                await updateUserMutation.mutateAsync({
                    id: userModel.id,
                    data: updateData
                });

                toast.success("User updated successfully");
                onOpenChange(false);
            } catch {
                console.error(error);
                toast.error("Failed to update user");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{userModel ? 'Update User' : 'Create User'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* FirstName Field */}
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

                        {/* LastName Field */}
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

                        {/* Username Field */}
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email Field */}
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
                        {/* Password Field */}
                        {!userModel && (
                            <>
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

                                {/* Confirm Password Field */}
                                <FormField
                                    name="confirmPassword"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="********" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        {/* Vendor Dropdown */}
                        {showVendorDropdown && (
                            <FormField
                                name="vendorId"
                                control={form.control}
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
                        {/* Role Select */}
                        <FormField
                            name="roles"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Roles</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select roles" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {roleOptions.map((role) => (
                                                <SelectItem key={role} value={role}>
                                                    {role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {userModel ? 'Update' : 'Create'} User
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default UserForm;