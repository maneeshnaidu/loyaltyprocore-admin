// // components/change-password-form.tsx
// 'use client';

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useAuth } from "@/components/providers/auth-provider";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { useState } from "react";
// import { PasswordSchema } from "@/lib/types";
// import { z } from "zod";

// export function ChangePasswordForm() {
//     const [isOpen, setIsOpen] = useState(false);
//     const { changePassword } = useAuth();
//     const [isLoading, setIsLoading] = useState(false);

//     type PasswordFormValues = z.infer<typeof PasswordSchema>;

//     const form = useForm<PasswordFormValues>({
//         resolver: zodResolver(PasswordSchema),
//         defaultValues: {
//             currentPassword: "",
//             newPassword: "",
//             confirmPassword: "",
//         },
//     });

//     const onSubmit = async (values: PasswordFormValues) => {
//         try {
//             setIsLoading(true);
//             await changePassword(values.currentPassword, values.newPassword);
//             toast.success("Password changed successfully");
//             setIsOpen(false);
//             form.reset();
//         } catch (error) {
//             toast.error("Failed to change password", {
//                 description: error instanceof Error ? error.message : "An unknown error occurred",
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <Dialog open={isOpen} onOpenChange={setIsOpen}>
//             <DialogTrigger asChild>
//                 <Button variant="outline" className="w-full">
//                     Change Password
//                 </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[425px]">
//                 <DialogHeader>
//                     <DialogTitle>Change Password</DialogTitle>
//                 </DialogHeader>
//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                         <FormField
//                             control={form.control}
//                             name="currentPassword"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Current Password</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             type="password"
//                                             placeholder="Enter your current password"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="newPassword"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>New Password</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             type="password"
//                                             placeholder="Enter your new password"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="confirmPassword"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Confirm New Password</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             type="password"
//                                             placeholder="Confirm your new password"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <Button type="submit" className="w-full" disabled={isLoading}>
//                             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                             Change Password
//                         </Button>
//                     </form>
//                 </Form>
//             </DialogContent>
//         </Dialog>
//     );
// }