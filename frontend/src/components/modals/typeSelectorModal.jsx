import { Car } from 'lucide-react';
import { Keyboard } from 'lucide-react';

export default function TypeSelectorModal({
  isOpen,
  onClose,
  onSelectType,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg border relative ">
        <h2 className="text-xl font-bold text-yellow-500 mb-4">
          Select Equipment Type
        </h2>
                        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl leading-none"
        >
          &times;
        </button>
        <div className="flex gap-4 justify-center">
          <button
            className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
            onClick={() => {
              onSelectType("PPE");
              onClose();
            }}
          >
            <Car className="h-4 w-4 inline-block mr-2" />
            PPE
          </button>
          <button
            className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
            onClick={() => {
              onSelectType("RPCSP");
              onClose();
            }}
          >
            <Keyboard className="h-4 w-4 inline-block mr-2" />
            RPCSP
          </button>
        </div>
      </div>
    </div>
  );
}
