import React, { useState } from "react";
import { Settings, Moon, Sun, User } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import config from "../../Config/config";

const SettingsModal = ({ onClose, darkTheme }) => {
  const [name, setName] = useState("");
  const [theme, setTheme] = useState(darkTheme ? "dark" : "light");
  const [isUpdating, setIsUpdating] = useState(false);

  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"])?.data;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`w-full max-w-2xl p-8 shadow-2xl md:p-10 rounded-3xl animate-fade-in ${modalBg}`}
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
              <Settings size={24} />
            </span>
            <h2 className={`text-2xl font-bold ${textColor}`}>User Settings</h2>
          </div>
          <button
            onClick={onClose}
            className={`text-xl ${secondaryText} transition hover:text-gray-400`}
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`p-2 rounded-full ${iconBg}`}>
                <User size={20} className={iconColor} />
              </span>
              <label
                htmlFor="name"
                className={`text-lg font-medium ${textColor}`}
              >
                Name
              </label>
            </div>
            <input
              id="name"
              type="text"
              placeholder="Enter your new name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-2/3 px-4 py-2 text-base border rounded-xl focus:outline-none focus:ring-2 ${inputBg} ${inputBorder} ${
                darkTheme ? "focus:ring-blue-700" : "focus:ring-blue-200"
              } ${textColor}`}
            />
          </div>

          <hr className={borderColor} />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`p-2 rounded-full ${iconBg}`}>
                {darkTheme ? (
                  <Sun size={20} className={iconColor} />
                ) : (
                  <Moon size={20} className={iconColor} />
                )}
              </span>
              <label
                htmlFor="theme"
                className={`text-lg font-medium ${textColor}`}
              >
                Theme
              </label>
            </div>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className={`w-2/3 px-4 py-2 text-base border rounded-xl focus:outline-none focus:ring-2 ${inputBg} ${inputBorder} ${
                darkTheme ? "focus:ring-blue-700" : "focus:ring-blue-200"
              } ${textColor}`}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-10">
          <button
            onClick={onClose}
            className={`px-5 py-2 text-base rounded-xl transition ${buttonBg} ${buttonHover} ${
              darkTheme ? "text-gray-200" : "text-gray-700"
            }`}
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-6 py-2 rounded-xl text-white transition text-base flex items-center justify-center min-w-[120px] ${primaryButtonBg} ${primaryButtonHover}`}
            disabled={isUpdating}
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
                Updating...
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
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SettingsModal;
