"use client"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { QrCodeIcon, PlusCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { QrScanner } from "./qr-scanner"
import { QueryObject } from "@/types"
import { AddPointSchema } from "@/lib/types"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "./providers/auth-provider"
import { useRewards } from "@/hooks/use-rewards"
import { useOutlets } from "@/hooks/use-outlets"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useAddPoints } from "@/hooks/use-points"

type formSchema = z.infer<typeof AddPointSchema>;

interface AddPointsProps {
    onSuccess?: () => void
}

const AddPoints = ({ onSuccess }: AddPointsProps) => {
    const [open, setOpen] = useState(false)
    const [showScanner, setShowScanner] = useState(false)
    const { user } = useAuth();

    const query: QueryObject = {
        vendorId: user?.vendor || undefined,
    };

    const { data: rewards } = useRewards(query);
    const { data: outlets } = useOutlets(query);

    const addPointsMutation = useAddPoints();

    const form = useForm<formSchema>({
        resolver: zodResolver(AddPointSchema),
        defaultValues: {
            userCode: 0,
            vendorId: user?.vendor || 0,
            rewardId: undefined,
            outletId: undefined,
            point: 0,
            orderId: undefined,
        }
    });

    const handleScanSuccess = (decodedText: string) => {
        const codeMatch = decodedText.match(/(\d+)$/)
        if (codeMatch) {
            form.setValue("userCode", Number(codeMatch[1]))
            toast.success("User code scanned successfully")
        } else {
            toast.error("Invalid QR format - must contain numbers")
        }
        setShowScanner(false)
    }

    const onSubmit = async (data: formSchema) => {
        console.log("test");
        try {
            await addPointsMutation.mutateAsync({
                customerCode: data.userCode,
                data: {
                    customerCode: data.userCode,
                    vendorId: user?.vendor || 0,
                    rewardId: data.rewardId,
                    outletId: data.outletId,
                    orderId: data.orderId || 0,
                    point: data.point
                }
            })

            toast.success("Points added successfully")
            form.reset()
            setOpen(false)
            onSuccess?.()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to add points")
        }
    }

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Add Points
                    </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-[425px] p-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <SheetHeader>
                                <SheetTitle>Add Points to User</SheetTitle>
                            </SheetHeader>

                            <div className="grid gap-4 py-4">
                                {/* Outlet Dropdown */}
                                <FormField
                                    control={form.control}
                                    name="outletId"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="outletId" className="text-right">
                                                Outlet
                                            </Label>
                                            <Select
                                                onValueChange={(value) => field.onChange(Number(value))}
                                                value={field.value?.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Select outlet" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {outlets?.map((outlet) => (
                                                        <SelectItem
                                                            key={outlet.id}
                                                            value={outlet.id.toString()}
                                                        >
                                                            {outlet.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="col-span-4 text-right" />
                                        </FormItem>
                                    )}
                                />

                                {/* Reward Dropdown */}
                                <FormField
                                    control={form.control}
                                    name="rewardId"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="rewardId" className="text-right">
                                                Reward
                                            </Label>
                                            <Select
                                                onValueChange={(value) => field.onChange(Number(value))}
                                                value={field.value?.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Select reward" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {rewards?.map((reward) => (
                                                        <SelectItem
                                                            key={reward.id}
                                                            value={reward.id.toString()}
                                                        >
                                                            {reward.description} ({reward.pointsRequired} pts)
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="col-span-4 text-right" />
                                        </FormItem>
                                    )}
                                />

                                {/* Points Field */}
                                <FormField
                                    control={form.control}
                                    name="point"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="points" className="text-right">
                                                Points
                                            </Label>
                                            <FormControl>
                                                <Input
                                                    id="points"
                                                    type="number"
                                                    className="col-span-3"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage className="col-span-4 text-right" />
                                        </FormItem>
                                    )}
                                />

                                {/* User Code Field */}
                                <FormField
                                    control={form.control}
                                    name="userCode"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="userCode" className="text-right">
                                                User Code
                                            </Label>
                                            <div className="col-span-3 flex gap-2">
                                                <FormControl>
                                                    <Input
                                                        id="userCode"
                                                        type="number"
                                                        placeholder="Enter or scan code"
                                                        value={field.value}
                                                        onChange={(e) => {
                                                            const value = parseInt(e.target.value, 10)
                                                            field.onChange(isNaN(value) ? 0 : value)
                                                        }}
                                                    />
                                                </FormControl>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setShowScanner(true)}
                                                >
                                                    <QrCodeIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <FormMessage className="col-span-4 text-right" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <SheetFooter>
                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? "Processing..." : "Add Points"}
                                </Button>
                            </SheetFooter>
                        </form>
                    </Form>
                </SheetContent>
            </Sheet>

            {/* QR Scanner Modal */}
            {showScanner && (
                <QrScanner
                    onScanSuccess={handleScanSuccess}
                    onClose={() => setShowScanner(false)}
                />
            )}
        </>
    )
}

export default AddPoints;