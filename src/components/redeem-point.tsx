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
import { QrCodeIcon, TicketCheck, Trophy } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { QrScanner } from "./qr-scanner"
import { QueryObject } from "@/types"
import { RedeemPointSchema } from "@/lib/types"
import { z } from "zod"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "./providers/auth-provider"
import { useRewards } from "@/hooks/use-rewards"
import { useOutlets } from "@/hooks/use-outlets"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useRedeemReward } from "@/hooks/use-points"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type formSchema = z.infer<typeof RedeemPointSchema>;

interface RedeemPointsProps {
    onSuccess?: () => void
}

const RedeemPoints = ({ onSuccess }: RedeemPointsProps) => {
    const [open, setOpen] = useState(false)
    const [showScanner, setShowScanner] = useState(false)
    const { user } = useAuth();

    const form = useForm<formSchema>({
        resolver: zodResolver(RedeemPointSchema),
        defaultValues: {
            userCode: 0,
            outletId: undefined,
            rewardId: undefined,
        }
    });

    // Watch the userCode field
    const userCode = useWatch({
        control: form.control,
        name: "userCode",
        defaultValue: 0
    });

    // Dynamic query based on userCode
    const rewardsQuery: QueryObject = {
        vendorId: user?.vendor || undefined,
        userCode: userCode > 0 ? userCode : undefined,
    };

    const { data: rewards } = useRewards(rewardsQuery);
    const { data: outlets } = useOutlets({
        vendorId: user?.vendor || undefined,
    });

    const redeemRewardsMutation = useRedeemReward();

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
        try {
            await redeemRewardsMutation.mutateAsync({
                rewardId: data.rewardId,
            })

            toast.success("Reward redeemed successfully")
            form.reset()
            setOpen(false)
            onSuccess?.()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to redeem reward")
        }
    }

    if (!form) return null; // Add this line to prevent rendering before form is ready

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button className="gap-2">
                        <TicketCheck className="h-4 w-4" />
                        Redeem Reward
                    </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-[425px] p-4">
                    {form && ( // Add this conditional render
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <SheetHeader>
                                    <SheetTitle>Redeem User Reward</SheetTitle>
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

                                    {/* Reward Cards Section */}
                                    {userCode > 0 && rewards && rewards.length > 0 && (
                                        <div className="space-y-2">
                                            <Label className="block text-right">Available Rewards</Label>
                                            <div className="grid gap-2">
                                                {rewards.map((reward) => (
                                                    <Card
                                                        key={reward.id}
                                                        className={`p-4 cursor-pointer transition-colors ${form.watch("rewardId") === reward.id
                                                            ? "border-primary bg-primary/10"
                                                            : "hover:bg-accent"
                                                            }`}
                                                        onClick={() => form.setValue("rewardId", reward.id)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Trophy className="h-6 w-6 text-yellow-500" />
                                                            <div>
                                                                <h3 className="font-medium">{reward.description}</h3>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {reward.pointsRequired} points
                                                                </p>
                                                            </div>
                                                            {form.watch("rewardId") === reward.id && (
                                                                <div className="ml-auto h-4 w-4 rounded-full bg-primary" />
                                                            )}
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {userCode > 0 && rewards && rewards.length === 0 && (
                                        <div className="text-center py-4 text-muted-foreground">
                                            <Trophy className="mx-auto h-8 w-8 mb-2" />
                                            <p>No rewards available for this user</p>
                                        </div>
                                    )}
                                </div>

                                <SheetFooter>
                                    <Button
                                        type="submit"
                                        disabled={form.formState.isSubmitting || !form.watch("rewardId")}
                                        className="w-full"
                                    >
                                        {form.formState.isSubmitting ? "Processing..." : "Redeem Reward"}
                                    </Button>
                                </SheetFooter>
                            </form>
                        </Form>
                    )}
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

export default RedeemPoints;