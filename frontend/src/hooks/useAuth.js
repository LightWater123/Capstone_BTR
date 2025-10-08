import { useQuery } from "@tanstack/react-query";
import axios from "../api/api";

export function useAuth() {
  // Fetch current user information
  const { data: user = null, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/user');
        return res.data;
      } catch (err) {
        console.error("User fetch failed:", err);
        return null;
      }
    },
    refetchInterval: 60000, // Refetch every minute
    refetchIntervalInBackground: false,
  });

  return { user, isLoading };
}