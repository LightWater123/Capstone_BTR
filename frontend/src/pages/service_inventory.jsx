import { useNavigate } from "react-router-dom";
import "../index.css";
import BTRheader from "../components/modals/btrHeader";
import Navbar from "../components/modals/serviceNavbar.jsx";

export default function ServiceInventory() {
  const navigate = useNavigate();

  const handleCreateServiceAccount = () => navigate("/register/service");
  const handleInventoryList = () => navigate("/inventory");

  return (
    <div className="min-h-screen bg-gray-50 relative">

      {/* 1.  Government banner */}
      <BTRheader />
      <Navbar />


            
       </div>
  );
}