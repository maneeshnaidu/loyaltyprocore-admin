"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RegisterVendorFormSchema } from "@/lib/types"
import { useCreateVendor } from "@/hooks/use-vendors"
import { Button } from "../ui/button"

type formSchema = z.infer<typeof RegisterVendorFormSchema>;

export function VendorForm() {
    const createVendorMutation = useCreateVendor();
    const form = useForm<formSchema>({
        resolver: zodResolver(RegisterVendorFormSchema),
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
    });

    const onSubmit = async (data: formSchema) => {
        try {
            const formData = new FormData();
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            formData.append("username", data.username);
            formData.append("email", data.email);
            formData.append("password", data.password);
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("category", data.category);
            if (data.logoImage) {
                formData.append("logoImage", data.logoImage);
            }
            if (data.coverImage) {
                formData.append("coverImage", data.coverImage);
            }
            await createVendorMutation.mutateAsync(formData);
            // setOpen(false); // Close dialog
        } catch (error) {
            console.error("Error adding vendor:", error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                                <Input placeholder="Your company name" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Description" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Input placeholder="Category" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="logoImage"
                    render={({ field }) => {
                        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                            const file = event.target.files?.[0]; // Get the selected file
                            console.log("Selected file:", file); // Log the selected file
                            field.onChange(file); // Update the form state
                        };

                        return (
                            <FormItem>
                                <FormLabel>Logo</FormLabel>
                                <FormControl>
                                    <Input type="file" onChange={handleFileChange} ref={field.ref} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => {
                        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                            const file = event.target.files?.[0]; // Get the selected file
                            field.onChange(file); // Update the form state
                        };

                        return (
                            <FormItem>
                                <FormLabel>Cover Image</FormLabel>
                                <FormControl>
                                    <Input type="file" onChange={handleFileChange} ref={field.ref} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
                <Button
                    type="submit"
                    disabled={createVendorMutation.isPending}
                >
                    {createVendorMutation.isPending ? "Saving..." : "Save"}
                </Button>
            </form>
        </Form>
    )
}
