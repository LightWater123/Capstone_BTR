import { useQuery } from "@tanstack/react-query";
import axios from "../api/api";

export function useServiceAuth() {
  // Fetch current service user information
  const { data: user = null, isLoading } = useQuery({
    queryKey: ['service-auth', 'user'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/service/user');
        //console.log("Service user API response:", res.data);
        return res.data;
      } catch (err) {
        // console.error("Service user fetch failed:", err);
        return null;
      }
    },
    refetchInterval: 60000, // Refetch every minute
    refetchIntervalInBackground: false,
  });

  return { user, isLoading };
}