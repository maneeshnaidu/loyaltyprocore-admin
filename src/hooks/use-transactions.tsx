import apiClient from "@/lib/api-client";
import { QueryObject, Transaction } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useTransactions = (query?: QueryObject) => {
    return useQuery({
        queryKey: ['transactions', query],
        queryFn: async () => {
            try {
                const response = await apiClient.get<Transaction[]>('/transactions', {
                    params: query
                });
                return response.data;
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
                throw error; // Let react-query handle the error
            }
        },
    });
};