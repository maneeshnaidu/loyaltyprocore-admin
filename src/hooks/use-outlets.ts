import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Outlet, QueryObject } from '@/types';

export const useOutlets = (query: QueryObject) => {
    return useQuery({
        queryKey: ['outlets', query],
        queryFn: async () => {
            try {
                const response = await apiClient.get<Outlet[]>('/outlets', {
                    params: query
                });
                return response.data;
            } catch (error) {
                console.error('Failed to fetch outlets:', error);
                throw error; // Let react-query handle the error
            }
        },
    });
};

export const useCreateOutlet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (outlet: FormData) =>
            apiClient.post('/outlets', outlet, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['outlets'] });
        },
    });
};

export const useDeleteOutlet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => apiClient.delete(`/outlets/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['outlets'] });
        },
    });
};

export const useUpdateOutlet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (outlet: Outlet) =>
            apiClient.put(`/outlets/${outlet.id}`, outlet),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['outlets'] });
        },
    });
};