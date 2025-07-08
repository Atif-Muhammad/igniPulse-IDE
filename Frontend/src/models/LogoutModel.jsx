import React from "react";
import { LogOut } from "lucide-react"; 

const LogoutModal = ({ onClose, onLogout }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center animate-fade-in scale-in">
        <div className="flex justify-center mb-4 text-red-600">
          <LogOut size={40} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Logout Confirmation
        </h2>
        <p className="text-gray-500 mb-6">
          Are you sure you want to logout? You’ll need to log in again.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl shadow-sm transition focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onLogout}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-sm transition focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Logout
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .scale-in {
          transform: scale(1);
        }
      `}</style>
    </div>
  );
};

export default LogoutModal;
