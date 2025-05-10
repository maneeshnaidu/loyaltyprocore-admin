import apiClient from "@/lib/api-client"
import { UpdatePointsDto } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useAddPoints = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: {
            customerCode: number
            data: UpdatePointsDto
        }) => {
            const { customerCode, data } = payload
            const response = await apiClient.post(
                `/points/${customerCode}`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            )
            return response.data
        },
        onError: (error: unknown) => {
            console.error("Add points error:", error)
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to add points"
            )
        },
        onSuccess: () => {
            // Invalidate relevant queries after successful addition
            queryClient.invalidateQueries({
                queryKey: ['points']
            })
            queryClient.invalidateQueries({
                queryKey: ['transactions']
            })
            toast.success("Points added successfully")
        }
    })
}

export const useRedeemReward = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: {
            rewardId: number;
        }) => {
            const { rewardId } = payload;
            const response = await apiClient.delete(
                `/points/${rewardId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            return response.data;
        },
        onError: (error: unknown) => {
            console.error("Redeem reward error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to redeem reward"
            );
        },
        onSuccess: () => {
            // Invalidate relevant queries after successful redemption
            queryClient.invalidateQueries({
                queryKey: ['rewards']
            });
            queryClient.invalidateQueries({
                queryKey: ['points']
            });
            queryClient.invalidateQueries({
                queryKey: ['transactions']
            });
            toast.success("Reward redeemed successfully");
        }
    });
};