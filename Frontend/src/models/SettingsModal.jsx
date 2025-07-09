import React, { useState } from "react";
import { Settings, Moon, User } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import config from "../../Config/config";

const SettingsModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("light");

  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"])?.data;
  const {mutate: handleSave} =  useMutation({
    mutationKey: ["updateName"],
    mutationFn: async ()=> await config.updateName({id: currentUser?.id, name}),
    onSuccess: onClose
  })

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-2xl p-8 md:p-10 rounded-3xl shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-full">
              <Settings size={24} />
            </span>
            <h2 className="text-2xl font-bold text-gray-800">User Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 flex flex-col gap-4 ">
          <div className="flex items-center  justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-gray-100 p-2 rounded-full">
                <User size={20} className="text-gray-500" />
              </span>
              <label
                htmlFor="name"
                className="text-lg font-medium text-gray-700"
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
              className="border border-gray-300 rounded-xl px-4 py-2 w-2/3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <hr className="border-gray-200" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-gray-100 p-2 rounded-full">
                <Moon size={20} className="text-gray-500" />
              </span>
              <label
                htmlFor="theme"
                className="text-lg font-medium text-gray-700"
              >
                Theme
              </label>
            </div>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 w-2/3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
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
            className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition text-base"
          >
            Save Changes
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
