import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../api/api";

export function useServiceInventory() {
  const queryClient = useQueryClient();

  // Fetch inventory maintenance items using TanStack Query with 10-second refetch interval
  const { data: maintenanceItems = [], refetch: refetchMaintenance } = useQuery({
    queryKey: ['service-inventory', 'maintenance'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/service/inventory');
        return res.data;
      } catch (err) {
        console.error("Maintenance items fetch failed:", err);
        return [];
      }
    },
    refetchInterval: 10000, // 10 seconds refetch interval
    refetchIntervalInBackground: false,
  });

  // Fetch archived items using TanStack Query with 10-second refetch interval
  const { data: archivedItems = [], refetch: refetchArchived } = useQuery({
    queryKey: ['service-inventory', 'archive'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/my-messages?status=done');
        return res.data;
      } catch (err) {
        console.error("Archived items fetch failed:", err);
        return [];
      }
    },
    refetchInterval: 10000, // 10 seconds refetch interval
    refetchIntervalInBackground: false,
  });

  // Fetch maintenance details for a specific item
  const { data: maintenanceDetails = null } = useQuery({
    queryKey: ['service-inventory', 'details'],
    queryFn: async ({ queryKey }) => {
      try {
        const id = queryKey[2]; // Extract ID from queryKey
        if (!id) return null;
        
        const res = await axios.get(`/api/service/inventory/${id}/maintenance`);
        return res.data;
      } catch (err) {
        console.error("Maintenance details fetch failed:", err);
        return null;
      }
    },
    enabled: false, // Only fetch when manually enabled
  });

  // Update maintenance status
  const updateStatus = async (jobId, newStatus) => {
    try {
      await axios.patch(`/api/maintenance-jobs/${jobId}/status`, {
        status: newStatus
      });
      
      // Update cache for maintenance items
      queryClient.setQueryData(['service-inventory', 'maintenance'], (prev) =>
        prev.map((item) =>
          item.id === jobId ? { ...item, status: newStatus } : item
        )
      );
      
      // Update cache for archived items
      queryClient.setQueryData(['service-inventory', 'archive'], (prev) =>
        prev.map((item) =>
          item.job?.id === jobId ? { ...item, job: { ...item.job, status: newStatus } } : item
        )
      );
      
      return true;
    } catch (err) {
      console.error("Status update failed:", err);
      return false;
    }
  };

  // Enable maintenance details query for specific ID
  const fetchMaintenanceDetails = (id) => {
    queryClient.invalidateQueries({
      queryKey: ['service-inventory', 'details']
    });
    queryClient.setQueryData(['service-inventory', 'details', id], null);
  };

  return {
    maintenanceItems,
    archivedItems,
    maintenanceDetails,
    refetchMaintenance,
    refetchArchived,
    updateStatus,
    fetchMaintenanceDetails
  };
}