import { useEffect, useState } from "react";

export default function ViewHistory({
  isOpen = true,
  setOpen = undefined,
  detailItem = undefined,
}) {
  // const [openModal, setOpen] = useState(false)
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  //console.log(JSON.stringify(detailItem));

  return (
    <div>
      {showModal ? (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[51]">
          <div className="bg-white rounded-xl p-6 w-full max-w-prose flex flex-col justify-between items-start">
            <div className="flex justify-between items-center mb-4 w-full">
              <h2 className="text-xl font-bold text-gray-800">History</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setOpen?.(false);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="grid grid-cols-1 w-full px-3 py-2 bg-slate-200">
              {detailItem.start_date || detailItem.end_date ? (
                <div className="flex justify-between">
                  <div>
                    <span className="font-bold block">Start Date:</span>
                    {detailItem.start_date}
                  </div>
                  <div>
                    <span className="font-bold block">End Date:</span>
                    {detailItem.end_date}
                  </div>
                </div>
              ) : (
                <div>No History</div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
