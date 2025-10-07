import { useState, useEffect } from "react";
import axios from "../api/api";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../App";

export function useInventory(category) {
  const [inventoryData, setInventoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetchInventory();
  }, [category]);   

  // fetch inventory

  const fetchInventory = async () => {
    try {
      const res = await axios.get(`/api/inventory?category=${category}`);
      setInventoryData(res.data);
      

    } catch (err) {
      console.error("Inventory fetch failed:", err);
      setInventoryData([]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`/api/inventory/${id}`);
      setInventoryData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // search function
  const filteredData = inventoryData.filter(item => {
    const query = searchQuery.toLowerCase();
    return item.article?.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query);
  });

  if(sortBy === "name") {
    filteredData.sort((a,b) => {
      const aItem = a.article.toLowerCase().trim()
      const bItem = b.article.toLowerCase().trim()
      if(aItem < bItem) return -1
      if(aItem > bItem) return 1
      return 0
    })
  } else if(sortBy === "price") {
    filteredData.sort((a,b) => b.unit_value - a.unit_value)
  }

  return {
    inventoryData,
    filteredData,
    searchQuery,
    setSearchQuery,
    fetchInventory,
    handleDelete,
    setInventoryData,
    setSortBy
  };
}
