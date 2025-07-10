import React from "react";
import { LogOut } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import config from "../../Config/config";
import { useNavigate } from "react-router-dom";

const LogoutModal = ({ onClose }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient()

  const { mutate: handleLogout, isPending } = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => await config.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries(["currentUser"]);
      navigate("/"); // Navigate to home page on success
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm p-6 text-center bg-white shadow-2xl rounded-2xl animate-fade-in scale-in">
        <div className="flex justify-center mb-4 text-red-600">
          <LogOut size={40} />
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">
          Logout Confirmation
        </h2>
        <p className="mb-6 text-gray-500">
          Are you sure you want to logout? You'll need to log in again.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-5 py-2 font-medium text-gray-700 transition bg-gray-100 shadow-sm hover:bg-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-sm transition focus:outline-none focus:ring-2 focus:ring-red-400 flex items-center justify-center min-w-[120px] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <svg
                  className="w-4 h-4 mr-2 -ml-1 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging out...
              </>
            ) : (
              "Logout"
            )}
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
