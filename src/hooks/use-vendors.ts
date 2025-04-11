import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Vendor } from '@/types';

export const useVendors = () => {
    return useQuery({
        queryKey: ['vendors'],
        queryFn: async () => {
            const response = await apiClient.get<Vendor[]>('/vendors');
            return response.data;
        },
    });
};

export const useCreateVendor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (vendor: Omit<Vendor, 'id'>) =>
            apiClient.post('/vendors', vendor),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendors'] });
        },
    });
};

export const useDeleteVendor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.delete(`/vendors/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendors'] });
        },
    });
};

export const useUpdateVendor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (vendor: Vendor) =>
            apiClient.put(`/vendors/${vendor.id}`, vendor),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendors'] });
        },
    });
};