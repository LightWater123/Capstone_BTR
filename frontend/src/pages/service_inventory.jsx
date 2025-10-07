// ServiceInventory.jsx - Service inventory page showing maintenance items and archive
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import BTRheader from "../components/modals/btrHeader";
import Navbar from "../components/modals/serviceNavbar.jsx";

export default function ServiceInventory() {
  const navigate = useNavigate(); 

  // Tab state: inventory (items under maintenance) or archive (completed maintenance)
  const [tab, setTab] = useState("inventory");
  
  // Category filter for maintenance items
  const [category, setCategory] = useState("PPE");
  
  // State for maintenance items
  const [maintenanceItems, setMaintenanceItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for selected item details
  const [selectedId, setSelectedId] = useState(null);
  const [maintenanceDetails, setMaintenanceDetails] = useState(null);
  
  // State for archived items (messages with related jobs)
  const [archivedItems, setArchivedItems] = useState([]);
  const [archiveLoading, setArchiveLoading] = useState(true);

  // Inside Inventory Fetch maintenance items based on category
  useEffect(() => {
    if (tab !== "inventory") return;
    setLoading(true);
    fetch(`http://localhost:8000/api/service/inventory`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((json) => {
        console.log("inv", json);
        setMaintenanceItems(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching inventory:", error);
        setLoading(false);
      });
  }, [tab]);

  // Fetch messages with related jobs (my-messages endpoint)
  useEffect(() => {
    if (tab !== "archive") return;
    setArchiveLoading(true);
    fetch("http://localhost:8000/api/my-messages?status=done", {
      credentials: "include"
    })
      .then((r) => r.json())
      .then((json) => {
        console.log("Messages data:", json);
        setArchivedItems(json);
        setArchiveLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
        setArchiveLoading(false);
      });
  }, [tab]);

  // Update maintenance status
  const updateStatus = async (jobId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/maintenance-jobs/${jobId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      // Update local state with new status
      setMaintenanceItems((prev) =>
        prev.map((item) =>
          item.id === jobId ? { ...item, status: newStatus } : item
        )
      );
      
      // Also update archived items if the item is there
      setArchivedItems((prev) =>
        prev.map((item) =>
          item.job?.id === jobId ? { ...item, job: { ...item.job, status: newStatus } } : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Load maintenance details for selected item 
  const loadMaintenanceDetails = (id) => {
    console.log(id)
    setSelectedId(id);
    fetch(`http://localhost:8000/api/service/inventory/${id}/maintenance`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then(setMaintenanceDetails)
      .catch((error) => {
        console.error("Error fetching maintenance details:", error);
        setMaintenanceDetails(null);
      });
  };

  // Status dropdown component
  const StatusDropdown = ({ itemId, currentStatus }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState(currentStatus || 'pending');
    const [dropdownPosition, setDropdownPosition] = useState({ left: 0, top: 0 });
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const handleStatusChange = (newStatus) => {
      setStatus(newStatus);
      setIsOpen(false);
      updateStatus(itemId, newStatus);
    };

    const getStatusColor = (status) => {
      switch(status) {
        case 'done': return 'bg-green-100 text-green-800';
        case 'in-progress': return 'bg-blue-100 text-blue-800';
        default: return 'bg-yellow-100 text-yellow-800';
      }
    };

    // Calculate dropdown position when opening
    const calculateDropdownPosition = () => {
      if (buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        // Position dropdown below the button
        setDropdownPosition({
          left: buttonRect.left,
          top: buttonRect.bottom + 5 // Add 5px spacing
        });
      }
    };

    // Handle button click
    const handleButtonClick = () => {
      if (!isOpen) {
        calculateDropdownPosition();
      }
      setIsOpen(!isOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    // Close dropdown when scrolling
    useEffect(() => {
      const handleScroll = () => {
        if (isOpen) {
          setIsOpen(false);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [isOpen]);

    // UI
    return (
      // Maintenance status dropdown
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          ref={buttonRef}
          onClick={handleButtonClick}
          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)} flex items-center gap-1 w-full text-left`}
        >
          {status}
          <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {isOpen && (
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              zIndex: 9999,
              left: dropdownPosition.left,
              top: dropdownPosition.top,
            }}
            className="w-48 bg-white rounded-md shadow-lg py-1"
          >
            <button
              onClick={() => handleStatusChange('pending')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusChange('in-progress')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              In Progress
            </button>
            <button
              onClick={() => handleStatusChange('done')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Done
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <BTRheader />
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header with tab switcher */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Service Inventory</h1>

          <div className="flex items-center gap-3">
            {/* Tab switcher */}
            <div className="flex gap-2">
              <button
                onClick={() => setTab("inventory")}
                className={`px-4 py-2 rounded ${
                  tab === "inventory" ? "bg-blue-600 text-white" : "bg-white border"
                }`}
              >
                Inventory
              </button>
              <button
                onClick={() => setTab("archive")}
                className={`px-4 py-2 rounded ${
                  tab === "archive" ? "bg-blue-600 text-white" : "bg-white border"
                }`}
              >
                Archive
              </button>
            </div>

            {/* Category filter buttons */}
            {tab === "inventory" && (
              <div className="flex gap-2">
                <button
                  onClick={() => setCategory("PPE")}
                  className={`px-4 py-2 rounded ${
                    category === "PPE" ? "bg-blue-600 text-white" : "bg-white border"
                  }`}
                >
                  PPE
                </button>
                <button
                  onClick={() => setCategory("RPCSP")}
                  className={`px-4 py-2 rounded ${
                    category === "RPCSP" ? "bg-blue-600 text-white" : "bg-white border"
                  }`}
                >
                  RPCSP
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Maintenance items table */}
        {tab === "inventory" ? (
          loading ? (
            <p className="text-gray-500">Loading maintenance items...</p>
          ) : (
            <div className="bg-white rounded shadow overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-sm uppercase text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Equipment</th>
                    <th className="px-4 py-3">Scheduled At</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
{maintenanceItems.map((item) => (
                  <tr
                    key={item.id} // Use _id for MongoDB
                    className="border-t hover:bg-gray-50"
                    onClick={() => loadMaintenanceDetails(item.asset_id)} // Use id
                  >
                    <td
                      className="px-4 py-3 cursor-pointer hover:text-blue-600"
                    >
                      {item.asset_name || "—"} {/* Use asset_name */}
                    </td>
                    <td className="px-4 py-3">
                      {item.scheduled_at ? new Date(item.scheduled_at).toLocaleDateString() : "—"}
                    </td>
                    <td
                      className="px-4 py-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Store button position for dropdown
                        const buttonRect = e.currentTarget.getBoundingClientRect();
                        // We'll handle the position in a different way
                      }}
                    >
                      <StatusDropdown
                        itemId={item.id}
                        currentStatus={item.status}
                      /> {/* Use id */}
                    </td>
                    <td className="px-4 py-3">{"—"}</td> {/* No message field on MaintenanceJob */}
                    <td
                      className="px-4 py-3 text-blue-600 cursor-pointer"
                      onClick={() => loadMaintenanceDetails(item.id)} // Use id
                    >
                      {">"}
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          // Archived items table with specific fields
          archiveLoading ? (
            <p className="text-gray-500">Loading archived items...</p>
          ) : (
            <div className="bg-white rounded shadow overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-sm uppercase text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Asset Name</th>
                    <th className="px-4 py-3">Scheduled Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Date Sent</th>
                  </tr>
                </thead>
                <tbody>
{archivedItems.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{item.job?.asset_name || "—"}</td>
                    <td className="px-4 py-3">
                      {item.job?.scheduled_at ?
                        new Date(item.job.scheduled_at).toLocaleDateString() : "—"
                      }
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.job?.status === 'done' ? 'bg-green-100 text-green-800' :
                        item.job?.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.job?.status || "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-xs truncate" title={item.body_html}>
                        {item.body_html ? item.body_html.replace(/<[^>]*>?/gm, '') : "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.created_at ?
                        new Date(item.created_at).toLocaleDateString() : "—"
                      }
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Maintenance details panel */}
        {selectedId && (
          <section className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 overflow-y-auto z-40">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Maintenance Details</h2>
              <button onClick={() => setSelectedId(null)} className="text-gray-500">
                ✕
              </button>
            </div>

            {maintenanceDetails ? (
              <>
                <p className="text-sm text-gray-500 mb-2">Equipment</p>
                <p className="mb-4">{maintenanceDetails.article || "—"}</p>

                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="mb-4">{maintenanceDetails.description || "—"}</p>

                <p className="text-sm text-gray-500 mb-2">Asset ID</p>
                <p className="mb-4">{maintenanceDetails.asset_id || "—"}</p>

                {maintenanceDetails.maintenance && maintenanceDetails.maintenance.length > 0 ? (
                  <>
                    <p className="text-sm text-gray-500 mb-2">Maintenance History</p>
                    {maintenanceDetails.maintenance.map((job, index) => (
                      <div key={job.id} className="mb-4 p-3 bg-gray-50 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            job.status === 'done' ? 'bg-green-100 text-green-800' :
                            job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {job.status || "pending"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {job.scheduled_at ? new Date(job.scheduled_at).toLocaleDateString() : "—"}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-1">Condition</p>
                        <p className="mb-2">{job.condition || "—"}</p>
                        
                        <p className="text-sm text-gray-500 mb-1">Remarks</p>
                        <p className="mb-2 whitespace-pre-wrap">{job.remarks || "—"}</p>
                        
                        <div className="flex text-xs text-gray-500">
                          <span className="mr-4">
                            Start: {job.start_date ? new Date(job.start_date).toLocaleDateString() : "—"}
                          </span>
                          <span>
                            End: {job.end_date ? new Date(job.end_date).toLocaleDateString() : "—"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-gray-500">No maintenance history found</p>
                )}
              </>
            ) : (
              <p className="text-gray-500">Loading maintenance details...</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}