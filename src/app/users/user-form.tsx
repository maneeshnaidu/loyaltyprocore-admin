import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterFormSchema } from "@/lib/types";
import { UserModel } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/components/providers/auth-provider";

type formSchema = z.infer<typeof RegisterFormSchema>;

interface UserFormProps {
    isOpen: boolean;
    userModel: UserModel | null;
    onOpenChange: (value: boolean) => void;
}

const UserForm = ({ isOpen, userModel, onOpenChange }: UserFormProps) => {
    const { user, registerUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState("");

    const form = useForm<formSchema>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: {
            firstName: userModel?.firstName || "",
            lastName: userModel?.lastName || "",
            email: userModel?.email || "",
            username: userModel?.userName || "",
            password: userModel?.password || "",
            admin: user?.userName,
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (userModel) {
            form.reset({
                firstName: userModel.firstName,
                lastName: userModel.lastName,
                email: userModel.email,
                username: userModel.userName || "",
            });
        } else {
            form.reset();
        }
    }, [form, isOpen, userModel]);

    const onSubmit = async (values: formSchema) => {
        setError("");
        setIsLoading(true);
        if (!user) {
            toast.error("You must be logged in to perform this action.");
            return;
        }

        try {
            const username = values.username;
            const email = values.email;
            const password = values.password;
            const firstName = values.firstName;
            const lastName = values.lastName || "";
            const admin = user.userName;

            await registerUser(username, email, password, firstName, lastName, admin);
            toast.success("User was added successfully.");
            onOpenChange(false);
        }
        catch (err) {
            setError('Error: ' + err);
            toast.error("There was a problem with your request.");
        } finally {
            setIsLoading(false);
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create User</DialogTitle>
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

                        <DialogFooter>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default UserForm;

