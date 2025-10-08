import { useState } from "react";
import axios from "../api/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useInventory(category) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const queryClient = useQueryClient();

  // Fetch inventory using TanStack Query with 10-second refetch interval
  const { data: inventoryData = [], refetch } = useQuery({
    queryKey: ['inventory', category],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/inventory?category=${category}`);
        return res.data;
      } catch (err) {
        console.error("Inventory fetch failed:", err);
        return [];
      }
    },
    refetchInterval: 10000, // 10 seconds refetch interval
    refetchIntervalInBackground: false,
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`/api/inventory/${id}`);
      // Invalidate the query to refetch data
      await queryClient.invalidateQueries({ queryKey: ['inventory', category] });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // search function
  const filteredData = inventoryData.filter(item => {
    const query = searchQuery.toLowerCase();
    return item.article?.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query);
  });

  // Create a sorted copy to avoid mutating the original array
  const sortedData = [...filteredData];
  
  if(sortBy === "name") {
    sortedData.sort((a,b) => {
      const aItem = a.article?.toLowerCase().trim() || "";
      const bItem = b.article?.toLowerCase().trim() || "";
      if(aItem < bItem) return -1
      if(aItem > bItem) return 1
      return 0
    })
  } else if(sortBy === "price") {
    sortedData.sort((a,b) => (b.unit_value || 0) - (a.unit_value || 0))
  }

  return {
    inventoryData,
    filteredData: sortedData,
    searchQuery,
    setSearchQuery,
    fetchInventory: refetch,
    handleDelete,
    setInventoryData: (data) => {
      // Update the query cache directly
      queryClient.setQueryData(['inventory', category], data);
    },
    setSortBy
  };
}
