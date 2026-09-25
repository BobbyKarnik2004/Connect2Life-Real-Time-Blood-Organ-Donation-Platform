import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { donorsApi, recipientsApi, matchingApi } from '../services/api';
import { useAppSelector } from '../store/hooks';

export const useDonors = (filters: any) => {
  return useQuery({
    queryKey: ['donors', filters],
    queryFn: () => donorsApi.getDonors(filters).then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => {
      // Apply client-side filtering if needed
      return data.filter((donor: any) => {
        const matchesBloodGroup = !filters.bloodGroup || donor.bloodGroup === filters.bloodGroup;
        const matchesDistance = !filters.distance || donor.distance <= filters.distance;
        const matchesSearch = !filters.searchQuery || 
          donor.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          donor.location.toLowerCase().includes(filters.searchQuery.toLowerCase());
        
        return matchesBloodGroup && matchesDistance && matchesSearch;
      });
    },
  });
};

export const useRecipients = (filters: any) => {
  return useQuery({
    queryKey: ['recipients', filters],
    queryFn: () => recipientsApi.getRecipients(filters).then(res => res.data),
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter cache for recipients as needs may be urgent)
    select: (data) => {
      // Apply client-side filtering if needed
      return data.filter((recipient: any) => {
        const matchesBloodGroup = !filters.bloodGroup || recipient.bloodGroup === filters.bloodGroup;
        const matchesDistance = !filters.distance || recipient.distance <= filters.distance;
        const matchesSearch = !filters.searchQuery || 
          recipient.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          recipient.location.toLowerCase().includes(filters.searchQuery.toLowerCase());
        
        return matchesBloodGroup && matchesDistance && matchesSearch;
      });
    },
  });
};

export const useRequestDonation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ donorId, message }: { donorId: string; message: string }) =>
      matchingApi.requestDonation(donorId, message),
    onSuccess: () => {
      toast.success('Donation request sent successfully');
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['donation-requests'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send donation request');
    },
  });
};

export const useRespondToRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ requestId, accept }: { requestId: string; accept: boolean }) =>
      matchingApi.respondToRequest(requestId, accept),
    onSuccess: (_, { accept }) => {
      toast.success(`Request ${accept ? 'accepted' : 'declined'} successfully`);
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['donation-requests'] });
      queryClient.invalidateQueries({ queryKey: ['donors'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to process request');
    },
  });
};

export const useDonationRequests = (status?: string) => {
  const user = useAppSelector((state) => state.auth.user);
  
  return useQuery({
    queryKey: ['donation-requests', status],
    queryFn: () => {
      // In a real app, you would have an endpoint to fetch requests
      // This is a placeholder that would be replaced with actual API call
      return Promise.resolve({ data: [] });
    },
    enabled: !!user?.id, // Only fetch if user is logged in
    select: (data: any) => {
      if (status) {
        return data.filter((request: any) => request.status === status);
      }
      return data;
    },
  });
};

export const useDonorProfile = (donorId?: string) => {
  return useQuery({
    queryKey: ['donor', donorId],
    queryFn: () => {
      if (!donorId) throw new Error('Donor ID is required');
      return donorsApi.getDonorById(donorId).then(res => res.data);
    },
    enabled: !!donorId,
  });
};

export const useRecipientProfile = (recipientId?: string) => {
  return useQuery({
    queryKey: ['recipient', recipientId],
    queryFn: () => {
      if (!recipientId) throw new Error('Recipient ID is required');
      return recipientsApi.getRecipientById(recipientId).then(res => res.data);
    },
    enabled: !!recipientId,
  });
};
