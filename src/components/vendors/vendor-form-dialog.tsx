"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateVendor } from "@/hooks/use-vendors"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PlusIcon } from "lucide-react"

export function VendorFormDialog() {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
    })

    const createVendorMutation = useCreateVendor()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await createVendorMutation.mutateAsync(formData)
            setFormData({ name: "", description: "", category: "" }) // Reset form
            setOpen(false) // Close dialog
        } catch (error) {
            console.error("Error adding vendor:", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <PlusIcon className="h-4 w-4" />
                    <span className="hidden lg:inline ml-2">Add Vendor</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Vendor</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new vendor.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Vendor Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter vendor name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, category: value })
                                }
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="retail">Retail</SelectItem>
                                    <SelectItem value="food">Food & Beverage</SelectItem>
                                    <SelectItem value="service">Service</SelectItem>
                                    <SelectItem value="technology">Technology</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter vendor description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                className="min-h-[100px]"
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={createVendorMutation.isPending}
                        >
                            {createVendorMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}