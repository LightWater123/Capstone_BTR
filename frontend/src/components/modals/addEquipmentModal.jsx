import React, { useEffect, useState } from 'react';

export default function AddEquipmentModal({
  isOpen,
  category,
  newItem,
  setNewItem,
  onClose,
  onSubmit,
  onUploadPDF
}) {
  // const [uploadedImage, setUploadedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // setUploadedImage(file)
      setPreviewImage(URL.createObjectURL(file))

      // const reader = new FileReader();
      // reader.onloadend = () => {
      //   setUploadedImage(reader.result);
      // };
      // reader.readAsDataURL(file);
    }
  };

  // resets the img selected in the upload img
  useEffect(()=>{
    if(!isOpen){
      setPreviewImage(null);
    }
  },[isOpen]); 

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-5xl shadow-lg border border-yellow-400 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-yellow-700 mb-6">
          Add New {category} Equipment
        </h2>

        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black"
        >
          {/* Left side – Drop files + Buttons */}
          <div className="flex flex-col items-center justify-start overflow-y-auto">
            <label
              htmlFor="imageUpload"
              className="w-72 h-72 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 mb-4"
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Uploaded"
                  className="w-full h-full object-contain rounded-md"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="text-sm">Drop or select files</p>
                </div>
              )}
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-4 pt-6">
              <button
                type="submit"
                className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-700 hover:text-white"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-700 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onUploadPDF}
                className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-700 hover:text-white"
              >
                Upload PPE/RPCSP PDF
              </button>
            </div>
          </div>

          {/* Right side – Form Fields */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Article"
              value={newItem.article}
              onChange={(e) =>
                setNewItem({ ...newItem, article: e.target.value })
              }
              className="w-full px-3 py-2 border border-black rounded bg-white-100 placeholder-black"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-black rounded bg-white-100 placeholder-black"
            />
            {category === "PPE" ? (
              <>
                <input
                  type="text"
                  placeholder="Property RO"
                  value={newItem.property_ro}
                  onChange={(e) =>
                    setNewItem({ ...newItem, property_ro: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-black rounded bg-white-100 placeholder-black"
                  required
                />
                <input
                  type="text"
                  placeholder="Property CO"
                  value={newItem.property_co}
                  onChange={(e) =>
                    setNewItem({ ...newItem, property_co: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-black rounded bg-white-100 placeholder-black"
                />
              </>
            ) : (
              <input
                type="text"
                placeholder="Semi-Expendable Property No"
                value={newItem.semi_expendable_property_no}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    semi_expendable_property_no: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-black rounded bg-white-100 placeholder-black"
                required
              />
            )}
            <input
              type="text"
              placeholder="Unit of Measure"
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
              className="w-full px-3 py-2 border border-black rounded bg-white-100 placeholder-black"
              required
            />
            <input
              type="number"
              placeholder="Unit Value"
              min="0"
              value={newItem.unit_value === 0 ? "" : newItem.unit_value}
              onKeyDown={(e) => {
                // Prevent the minus key, plus key, and 'e'/'E' from being pressed.
                if (
                  e.key === "-" ||
                  e.key === "+" ||
                  e.key === "e" ||
                  e.key === "E"
                ) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const numericValue = Number(e.target.value);
                const value = isNaN(numericValue)
                  ? 0
                  : Math.max(0, numericValue);
                setNewItem({ ...newItem, unit_value: value });
              }}
              className="w-full px-3 py-2 border border-black rounded bg-white-100 placeholder-black"
              required
            />
            <input
              type="number"
              placeholder="Quantity per Property Card"
              value={newItem.recorded_count === 0 ? "" : newItem.recorded_count}
              onChange={(e) => {
                const value =
                  e.target.value === "" ? 0 : Number(e.target.value);
                setNewItem({ ...newItem, recorded_count: value });
              }}
              className="w-full px-3 py-2 border border-black rounded bg-white-100 placeholder-black"
              required
            />
            <input
              type="number"
              placeholder="Quantity per Physical Count"
              value={newItem.actual_count === 0 ? "" : newItem.actual_count}
              onChange={(e) => {
                const value =
                  e.target.value === "" ? 0 : Number(e.target.value);
                setNewItem({ ...newItem, actual_count: value });
              }}
              className="w-full px-3 py-2 border border-black rounded bg-white-100 placeholder-black"
              required
            />
            <select
              value={newItem.location}
              onChange={(e) =>
                setNewItem({ ...newItem, location: e.target.value })
              }
              className="w-full px-3 py-2 border border-black rounded bg-white-100 text-black"
              required
            >
              <option value="">Select Location</option>
              <option value="RD's Office">RD's Office</option>
              <option value="Storage Room">Storage Room</option>
              <option value="Conference Room">Conference Room</option>
              <option value="Auditor's Office">Auditor's Office</option>
              <option value="Car Port/Garage">Car Port/Garage</option>
              <option value="CTOO II Office">CTOO II Office</option>
              <option value="Records Room">Records Room</option>
              <option value="Outside the building">Outside the building</option>
              <option value="Within the building">Within the building</option>
            </select>
            <input
              type="text"
              placeholder="Remarks"
              value={newItem.remarks}
              onChange={(e) =>
                setNewItem({ ...newItem, remarks: e.target.value })
              }
              className="w-full px-3 py-2 border border-black rounded bg-white-100 placeholder-black"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
