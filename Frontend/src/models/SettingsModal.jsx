import React, { useState, useEffect } from "react";
import { Settings, Moon, Sun, User } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import config from "../../Config/config";

const SettingsModal = ({ onClose, darkTheme }) => {
  const [name, setName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"])?.data;

  useEffect(() => {
    // Disable save button if input is empty or contains only whitespace
    setIsDisabled(name.trim() === "");
  }, [name]);

  const { mutate: handleSave } = useMutation({
    mutationKey: ["updateName"],
    mutationFn: async () => {
      setIsUpdating(true);
      return await config.updateName({ id: currentUser?.id, name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profile", currentUser?.id]);
      onClose();
    },
    onSettled: () => {
      setIsUpdating(false);
    },
  });

  // Theme color variables
  const modalBg = darkTheme ? "bg-gray-800" : "bg-white";
  const textColor = darkTheme ? "text-gray-100" : "text-gray-800";
  const secondaryText = darkTheme ? "text-gray-300" : "text-gray-600";
  const borderColor = darkTheme ? "border-gray-700" : "border-gray-200";
  const inputBg = darkTheme ? "bg-gray-700" : "bg-white";
  const inputBorder = darkTheme ? "border-gray-600" : "border-gray-300";
  const iconBg = darkTheme ? "bg-gray-700" : "bg-gray-100";
  const iconColor = darkTheme ? "text-gray-300" : "text-gray-500";
  const buttonBg = darkTheme ? "bg-gray-700" : "bg-gray-100";
  const buttonHover = darkTheme ? "hover:bg-gray-600" : "hover:bg-gray-200";
  const primaryButtonBg = darkTheme ? "bg-blue-600" : "bg-blue-600";
  const primaryButtonHover = darkTheme
    ? "hover:bg-blue-700"
    : "hover:bg-blue-700";
  const disabledButtonBg = darkTheme ? "bg-gray-600" : "bg-gray-300";
  const disabledButtonText = darkTheme ? "text-gray-400" : "text-gray-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`w-full max-w-md p-8 shadow-2xl md:p-6 rounded-2xl animate-fade-in ${modalBg}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span
              className={`p-2 rounded-full ${
                darkTheme
                  ? "bg-blue-700 text-blue-100"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <Settings size={20} />
            </span>
            <h2 className={`text-xl font-bold ${textColor}`}>User Settings</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-full hover:bg-gray-700/30 transition ${secondaryText}`}
            aria-label="Close settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4 ">
            <div className="flex items-center mb-3 gap-3">
              <span className={`p-2 rounded-full ${iconBg}`}>
                <User size={18} className={iconColor} />
              </span>
              <label htmlFor="name" className={`font-medium ${textColor}`}>
                Update your name
              </label>
            </div>
            <input
              id="name"
              type="text"
              placeholder="Enter your new name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 ${inputBg} ${inputBorder} ${
                darkTheme ? "focus:ring-blue-700" : "focus:ring-blue-200"
              } ${textColor}`}
              autoFocus
            />
          </div>

          <hr className={borderColor} />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm rounded-lg transition ${buttonBg} ${buttonHover} ${
              darkTheme ? "text-gray-200" : "text-gray-700"
            }`}
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isDisabled || isUpdating}
            className={`px-5 py-2 rounded-lg text-white transition text-sm flex items-center justify-center min-w-[100px] ${
              isDisabled || isUpdating
                ? `${disabledButtonBg} ${disabledButtonText} cursor-not-allowed`
                : `${primaryButtonBg} ${primaryButtonHover}`
            }`}
          >
            {isUpdating ? (
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
                Saving...
              </>
            ) : (
              "Save Changes"
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
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SettingsModal;
