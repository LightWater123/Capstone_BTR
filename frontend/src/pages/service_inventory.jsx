/*  ServiceInventory.jsx  –  full-page navigation version
----------------------------------------------------------*/
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import BTRheader from "../components/modals/btrHeader";
import Navbar from "../components/modals/serviceNavbar.jsx";

export default function ServiceInventory() {
  const navigate = useNavigate();

  /* ---------- original inventory state ---------- */
  const [category, setCategory] = useState("PPE");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [maintenance, setMaintenance] = useState(null);

  /* ---------- data ---------- */
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/api/service/inventory?category=${category}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((json) => {
        setList(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  /* ---------- maintenance detail panel ---------- */
  const loadMaintenance = (id) => {
    setSelectedId(id);
    fetch(`http://localhost:8000/api/service/inventory/${id}/maintenance`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then(setMaintenance)
      .catch(() => setMaintenance(null));
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <BTRheader />
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* top bar with Monitor Maintenance button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Service Inventory</h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/service/messages")}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Monitor Maintenance
            </button>

            {/* PPE / RPCSP switch */}
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
          </div>
        </div>

        {/* inventory table */}
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-sm uppercase text-gray-600">
                <tr>
                  {category === "PPE" ? (
                    <>
                      <th className="px-4 py-3">Article</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Property Number (RO)</th>
                      <th className="px-4 py-3">Property Number (CO)</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3">Article</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Semi-Expendable Property Number</th>
                    </>
                  )}
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>

              <tbody>
                {list.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                    onClick={() => loadMaintenance(item.id)}
                  >
                    {category === "PPE" ? (
                      <>
                        <td className="px-4 py-3">{item.article}</td>
                        <td className="px-4 py-3">{item.description}</td>
                        <td className="px-4 py-3">{item.property_ro}</td>
                        <td className="px-4 py-3">{item.property_co || "—"}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3">{item.article}</td>
                        <td className="px-4 py-3">{item.description}</td>
                        <td className="px-4 py-3">{item.semi_expendable_property_no}</td>
                      </>
                    )}
                    <td className="px-4 py-3 text-blue-600">›</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* maintenance detail panel (existing) */}
        {selectedId && (
          <section className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 overflow-y-auto z-40">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Maintenance Progress</h2>
              <button onClick={() => setSelectedId(null)} className="text-gray-500">
                ✕
              </button>
            </div>

            {maintenance ? (
              <>
                <p className="text-sm text-gray-500 mb-2">Article</p>
                <p className="mb-4">{maintenance.article}</p>

                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="mb-4">{maintenance.description}</p>

                <p className="text-sm text-gray-500 mb-2">Start Date</p>
                <p className="mb-4">{maintenance.maintenance.start_date || "—"}</p>

                <p className="text-sm text-gray-500 mb-2">End Date</p>
                <p className="mb-4">{maintenance.maintenance.end_date || "—"}</p>

                <p className="text-sm text-gray-500 mb-2">Condition</p>
                <p className="mb-4">{maintenance.maintenance.condition || "—"}</p>

                <p className="text-sm text-gray-500 mb-2">Remarks</p>
                <p className="whitespace-pre-wrap">{maintenance.maintenance.remarks || "—"}</p>
              </>
            ) : (
              <p className="text-gray-500">No maintenance data.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}