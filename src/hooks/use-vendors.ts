import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { UpdateVendorRequestDto, UpdateVendorResponse, Vendor } from '@/types';

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
        mutationFn: (vendor: FormData) =>
            apiClient.post('/vendors', vendor, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendors'] });
        },
    });
};

export const useDeleteVendor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => apiClient.delete(`/vendors/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendors'] });
        },
    });
};

export const useUpdateVendor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: number; data: UpdateVendorRequestDto }) => {
            const { id, data } = payload;
            const response = await apiClient.put<UpdateVendorResponse>(
                `/vendors/${id}`,
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
            console.error("Update vendor error:", error);
            throw error; // Let the calling component handle the error
        },
        onSuccess: () => {
            // Invalidate and refetch vendors query
            queryClient.invalidateQueries({
                queryKey: ['vendors']
            });
        },
    });
};