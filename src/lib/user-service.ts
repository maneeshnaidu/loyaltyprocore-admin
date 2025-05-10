import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "./api-client";
import { QueryObject, UpdateUserRequestDto, UpdateUserResponseDto, UserModel } from "@/types";

export const useUsers = (query: QueryObject) => {
    return useQuery({
        queryKey: ['users', query],
        queryFn: async () => {
            const response = await apiClient.get<UserModel[]>('/users', {
                params: query
            });
            return response.data;
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: string, data: UpdateUserRequestDto }) => {
            const { id, data } = payload;
            const response = await apiClient.put<UpdateUserResponseDto>(
                `/users/${id}`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error: unknown) => {
            console.error("Update user error:", error);
            throw error; // Let the calling component handle the error
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.delete(`/users/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};