import apiClient from "@/lib/api-client";
import { QueryObject, Reward } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useRewards = (query?: QueryObject) => {
    return useQuery({
        queryKey: ['rewards', query],
        queryFn: async () => {
            try {
                const response = await apiClient.get<Reward[]>('/rewards', {
                    params: query
                });
                return response.data;
            } catch (error) {
                console.error('Failed to fetch rewards:', error);
                throw error; // Let react-query handle the error
            }
        },
    });
};

export const useCreateReward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: number; data: Omit<Reward, 'id'> }) => {
            const { id, data } = payload;
            const response = await apiClient.post<Reward>(
                `/rewards/${id}`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        },
        onError: (error: unknown) => {
            console.error("Create reward error:", error);
            throw error; // Let the calling component handle the error
        },
        onSuccess: () => {
            // Invalidate and refetch vendors query
            queryClient.invalidateQueries({
                queryKey: ['rewards']
            });
        },
    });
};

export const useUpdateReward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (reward: Reward) =>
            apiClient.put(`/rewards/${reward.id}`, reward),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rewards'] });
        },
    });
};

export const useDeleteReward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => apiClient.delete(`/rewards/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rewards'] });
        },
    });
};

