import { useState, useEffect } from "react";
import { useInventory } from "../hooks/useInventory";
import { useMaintenance } from "../hooks/useMaintenance";
import { parsePdf } from "../hooks/usePdfParser";
import { useCsrf } from "../hooks/useCsrf";
import api from "../api/api";

// Modals
import ScheduleMaintenanceModal from "../components/modals/sched_maintenance_modal.jsx";
import TypeSelectorModal from "../components/modals/typeSelectorModal.jsx";
import AddEquipmentModal from "../components/modals/addEquipmentModal.jsx";
import UploadPDFModal from "../components/modals/uploadPDFModal.jsx";
import ViewFullDetailModal from "../components/modals/fullDetailModal.jsx";
import EditItemModal from "../components/modals/editItemModal.jsx";

export default function InventoryDashboard() {
  useCsrf();

  // Category state
  const [category, setCategory] = useState("PPE");

  // Inventory hook
  const {
    inventoryData,
    filteredData,
    searchQuery,
    setSearchQuery,
    fetchInventory,
    handleDelete,
    setInventoryData
  } = useInventory(category);

  // Maintenance hook
  const { maintenanceSchedules, fetchSchedules } = useMaintenance();

  // Modals
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Selected items
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState([]);

  // PDF file
  const [pdfFile, setPdfFile] = useState(null);

  //New item form
  const initialShape = (cat) => ({
    category: cat,
    article: "",
    description: "",
    property_ro: "",
    property_co: "",
    semi_expendable_property_no: "",
    recorded_count: 0,
    actual_count: 0,
    unit: "pc",
    unit_value: 0,
    location: "",
    remarks: ""
  });

  // state 
  const [newItem, setNewItem] = useState(initialShape(category));

  // keep category in sync
  useEffect(() => {
    setNewItem(prev => ({ ...prev, category }));
  }, [category]);

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // strip empty spaces
    const payload = Object.fromEntries(
      Object.entries(newItem).map(([k, v]) => [
        k,
        typeof v === "string" && v.trim() === "" ? null : v
      ])
    );

    try {
      await api.post("/api/inventory", payload);
      setShowModal(false);
      setNewItem(initialShape(category));   // reset
      await fetchInventory();
    } catch (err) {
      console.error("Add item failed:", err.response?.data || err);
      alert("Failed to add item. Please check your input.");
    }
  };

  // PDF upload and parse
  const handlePdfUpload = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      alert("Please select a PDF file first.");
      return;
    }

    try {
      const rows = await parsePdf(pdfFile, category);

      if (!rows || rows.length === 0) {
        alert("No data found in the PDF.");
        return;
      }

      const formattedItems = rows.map((row, index) => ({
        id: Date.now() + index,
        category,
        article: row.article || "",
        description: row.description || "",
        property_ro: row.property_RO || "",
        property_co: row.property_CO || "",
        semi_expendable_property_no: row.semi_expendable_property_no || "",
        unit: row.unit_of_measure || "",
        unit_value: Number(row.unit_value) || 0,
        recorded_count: Number(row.quantity_per_property_card) || 0,
        actual_count: Number(row.quantity_per_physical_count) || 0,
        location: row.whereabouts || "",
        remarks: row.remarks || ""
      }));

      setInventoryData(prev => [...prev, ...formattedItems]);
      setShowPdfModal(false);
      setShowModal(false);
      alert("PDF uploaded and inventory updated!");
    } catch (err) {
      console.error("PDF parse failed:", err);
      alert("Failed to parse PDF.");
    }
  };

  // render component UI
  return (
    <>
    {/* Header */}
    <div className="header px-4 py-3 border-b bg-white">
      <h1 className="text-2xl font-bold text-gray-800">
        Preventive Maintenance - Inventory
      </h1>
    </div>

    {/* Category Tabs */}
    <div className="flex gap-4 px-4 pt-4">
      {["PPE", "RPCSP"].map((type) => (
        <button
          key={type}
          className={`px-4 py-2 rounded-md ${
            category === type ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setCategory(type)}
        >
          {type}
        </button>
      ))}
    </div>

    {/* Search Field */}
    <div className="px-4 pt-4">
      <input
        type="text"
        placeholder={`Search ${category} items...`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
    </div>

    {/* Action Buttons */}
    <div className="px-4 pt-4">
      <button
        className="bg-yellow-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-yellow-600"
        onClick={() => setShowTypeSelector(true)}
      >
        Add Equipment
      </button>

      <button
        disabled={selectedEquipmentIds.length === 0}
        onClick={() => setShowScheduleModal(true)}
        className={`mt-4 px-4 py-2 rounded-md font-semibold ml-4 ${
          selectedEquipmentIds.length > 0
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Schedule Maintenance
      </button>
    </div>

    {/* Inventory Table */}
    <div className="px-4 pt-6">
      {filteredData.length === 0 ? (
        <p className="text-gray-500">No equipment found in {category}.</p>
      ) : (
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-black-100">
            <tr>
              <th className="border px-2 py-1">Article</th>
              <th className="border px-2 py-1">Description</th>
              {category === "PPE" ? (
                <>
                  <th className="border px-2 py-1">Property Number (RO)</th>
                  <th className="border px-2 py-1">Property Number (CO)</th>
                </>
              ) : (
                <th className="border px-2 py-1">Semi-Expendable Property No.</th>
              )}
              <th className="border px-2 py-1">Unit</th>
              <th className="border px-2 py-1">Unit Value</th>
              <th className="border px-2 py-1">Actions</th>
              <th className="border px-2 py-1 text-center">
                <input
                  type="checkbox"
                  checked={
                    filteredData.length > 0 &&
                    selectedEquipmentIds.length === filteredData.length
                  }
                  onChange={(e) => {
                    setSelectedEquipmentIds(
                      e.target.checked ? filteredData.map((item) => item.id) : []
                    );
                  }}
                  className="accent-green-500 w-4 h-4"
                  title="Select All"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100 transition">
                <td className="border px-2 py-1 text-center">{item.article}</td>
                <td className="border px-2 py-1 text-center">{item.description}</td>
                {item.category === "PPE" ? (
                  <>
                    <td className="border px-2 py-1 text-center">{item.property_ro}</td>
                    <td className="border px-2 py-1 text-center">
                      {item.property_co || <span className="text-gray-400 italic">—</span>}
                    </td>
                  </>
                ) : (
                  <td className="border px-2 py-1 text-center">{item.semi_expendable_property_no}</td>
                )}
                <td className="border px-2 py-1 text-center">{item.unit}</td>
                <td className="border px-2 py-1 text-center">₱{Number(item.unit_value).toLocaleString()}</td>
                <td className="border px-2 py-1 text-center space-x-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    onClick={() => {
                      setSelectedDetailItem(item);
                      setShowDetailModal(true);
                    }}
                  >
                    View Full Detail
                  </button>
                </td>
                <td className="border px-2 py-1 text-center">
                  <input
                    type="checkbox"
                    checked={selectedEquipmentIds.includes(item.id)}
                    onChange={(e) => {
                      setSelectedEquipmentIds((prev) =>
                        e.target.checked
                          ? [...prev, item.id]
                          : prev.filter((id) => id !== item.id)
                      );
                    }}
                    className="accent-green-500 w-4 h-4"
                    title="Select for Maintenance"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

    {/* Modals */}
    <TypeSelectorModal
      isOpen={showTypeSelector}
      onClose={() => setShowTypeSelector(false)}
      onSelectType={(type) => {
        setCategory(type);
        setNewItem((prev) => ({ ...prev, category: type }));
        setShowModal(true);
      }}
    />

    <AddEquipmentModal
      isOpen={showModal}
      category={category}
      newItem={newItem}
      setNewItem={setNewItem}
      onClose={() => {
        setShowModal(false);
        setNewItem({
          category,
          article: "",
          description: "",
          property_ro: "",
          property_co: "",
          semi_expendable_property_no: "",
          recorded_count: 0,
          actual_count: 0,
          unit: "pc",
          unit_value: 0,
          location: "",
          remarks: ""
        });
      }}
      onSubmit={handleSubmit}
      onUploadPDF={() => setShowPdfModal(true)}
    />

    <UploadPDFModal
      isOpen={showPdfModal}
      onClose={() => setShowPdfModal(false)}
      onSubmit={handlePdfUpload}
      setPdfFile={setPdfFile}
    />

    <ScheduleMaintenanceModal
      isOpen={showScheduleModal}
      onClose={() => setShowScheduleModal(false)}
      equipmentId={selectedEquipmentIds[0]}
      onSuccess={() => {
        setShowScheduleModal(false);
        setSelectedEquipmentIds([]);
        fetchSchedules();
      }}
    />

    <ViewFullDetailModal
      isOpen={showDetailModal}
      item={selectedDetailItem}
      onClose={() => setShowDetailModal(false)}
      onEdit={() => {
        setSelectedItem(selectedDetailItem);
        setShowEditModal(true);
      }}
      onDelete={async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
          await api.delete(`/api/inventory/${id}`);
          alert("Item deleted successfully!");
          setInventoryData((prev) => prev.filter((item) => item.id !== id));
          setShowDetailModal(false);
        } catch (err) {
          alert("Error deleting item. Please try again.");
          console.error("Error deleting item:", err);
        }
      }}
    />

    <EditItemModal
      isOpen={showEditModal}
      item={selectedItem}
      onClose={() => setShowEditModal(false)}
      onSave={async (updatedItem) => {
        setShowEditModal(false);
        await fetchInventory();
        setSelectedDetailItem(updatedItem);
      }}
    />

    {/* Maintenance Schedule Display */}
    <div className="px-4 pt-6">
      {maintenanceSchedules.map((schedule) => (
        <div key={schedule.id} className="border p-3 mb-2 rounded bg-white shadow-sm">
          <p><strong>Equipment ID:</strong> {schedule.equipment_id}</p>
          <p><strong>Date:</strong> {schedule.scheduled_date}</p>
          <p><strong>Contact:</strong> {schedule.contact_name} ({schedule.email})</p>
          <p><strong>Notes:</strong> {schedule.notes}</p>
          <p><strong>Status:</strong> {schedule.status}</p>
        </div>
      ))}
    </div>
  </>
  );
}