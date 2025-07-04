import React, { useState } from "react";
import { Copy, Lock } from "lucide-react";
import { BadgesModal } from "../models/BadgesModal";
import badges1 from "../../public/badges/Badges1.png";
import badges2 from "../../public/badges/Badges2.png";
import badges3 from "../../public/badges/Badges3.png";

export const Profile = () => {
  const [activeTab, setActiveTab] = useState("Python");
  const [showBadgesModal, setShowBadgesModal] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here if needed
  };

  return (
    <>
      <div className="p-4 md:px-8 py-12 bg-gray-100 min-h-screen">
        <div className="flex flex-col  md:flex-row gap-2">
          {/* Left Sidebar - Fixed */}
          <div className="md:w-1/4 w-full mt-10 bg-white shadow-black border-2 border-blue-500 rounded-2xl shadow-md flex flex-col items-center text-center  overflow-visible pb-5 pt-20 md:sticky md:top-24 h-fit">
            {/* Profile Image - absolute overlap */}
            <div className="absolute md:top-0 top-20 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <img
                src="/smile.png"
                alt="User avatar"
                className="w-36 h-36 rounded-full object-cover bg-gray-500 border-4 border-blue-500 shadow-xl"
              />
            </div>

            <div className=" w-full px-4 flex flex-col gap-5 ">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Haris Khan</h2>
                <p className="text-md text-gray-500 mb-4">
                  haris.ignupulse@gmail.com
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  Current Level
                </h3>
                <p className="text-md text-gray-600 ">Double Star Ranker</p>

                <div className="flex items-center  justify-between gap-2 mb-4">
                  <img src={badges1} className="w-20 h-20" alt="Star icon" />
                  <div className="flex-1 bg-gray-300 rounded-full h-2 overflow-hidden relative">
                    <div
                      className="absolute top-0 left-0 bg-red-500 h-2 rounded-full transition-all duration-700 ease-in-out"
                      style={{ width: "84%" }}
                    ></div>
                  </div>
                  <img src={badges3} className="w-20 h-20" alt="Star icon" />
                </div>

                <p className="text-lg text-gray-700 mb-1">
                  You have{" "}
                  <strong className="font-extrabold text-black">10,116</strong>{" "}
                  Points
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Rean 84 points to Triple star badges rank
                </p>
              </div>
            </div>

            <div className="w-11/12 bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-4">
              <div className="flex flex-col gap-3 text-md text-gray-500 font-medium">
                <div className="flex justify-between">
                  <p>Total Executions</p>
                  <p className="text-black font-bold">0</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-green-600">Successful</p>
                  <p className="text-green-600 font-bold">0</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-red-500">Errors</p>
                  <p className="text-red-500 font-bold">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section - Scrollable */}
          <div className="md:w-1/2 bg-white border-2 shadow-black border-blue-500 rounded-xl shadow-md p-5 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-xl  text-gray-800">
                  Achievements &amp; Badges
                </h2>
              </div>
              <div className="flex justify-center bg-[#FAF7F7] items-center gap-4 p-4 rounded-lg ">
                <img src={badges1} className="w-24 h-24" />
                <img src={badges2} className="w-24 h-24" />
                <img src={badges3} className="w-24 h-24" />
                <img src={badges1} className="w-24 h-24" />
                <button
                  onClick={() => setShowBadgesModal(true)}
                  className="bg-[#D9D9D9] px-3 py-2 text-sm rounded-xl hover:bg-gray-200"
                >
                  See all
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="font-bold text-gray-800 text-xl">
                Recent Successful Executions
              </h2>
              <div className="mt-2 flex">
                {["Python", "SQL"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-1/2 py-2 text-md font-semibold rounded-t-md transition-all duration-300 ${
                      activeTab === tab
                        ? "bg-[#FAF7F7] text-black border-t border-l border-r border-gray-300"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="bg-[#FAF7F7] px-4 border-b border-l border-r border-gray-300 py-5 rounded-b-lg space-y-6">
                {activeTab === "Python" && (
                  <>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500 font-medium">
                        Yesterday
                      </p>
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-[#1e293b] text-white px-4 py-3 rounded-lg text-sm mb-2 flex justify-between items-center font-mono shadow hover:shadow-lg transition-all"
                        >
                          <span>print("Hello World!")</span>
                          <button
                            onClick={() =>
                              copyToClipboard('print("Hello World!")')
                            }
                            className="text-gray-400 cursor-pointer hover:text-white"
                            title="Copy to clipboard"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm text-gray-500 font-medium">
                        April 25, 2025
                      </p>
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-[#1e293b] text-white px-4 py-3 rounded-lg text-sm mb-2 flex justify-between items-center font-mono shadow hover:shadow-lg transition-all"
                        >
                          <span>print("Hello World!")</span>
                          <button
                            onClick={() =>
                              copyToClipboard('print("Hello World!")')
                            }
                            className="text-gray-400 cursor-pointer hover:text-white"
                            title="Copy to clipboard"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm text-gray-500 font-medium">
                        April 22, 2025
                      </p>
                      <div className="bg-[#1e293b] text-white px-4 py-3 rounded-lg text-sm mb-2 flex justify-between items-center font-mono shadow hover:shadow-lg transition-all">
                        <span>print("Hello World!")</span>
                        <button
                          onClick={() =>
                            copyToClipboard('print("Hello World!")')
                          }
                          className="text-gray-400 cursor-pointer hover:text-white"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "SQL" && (
                  <p className="text-sm text-gray-600">
                    No SQL executions available.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Scrollable */}
          <div className="md:w-1/4 w-full sticky top-12 no-scrollbar bg-white border-2 shadow-black border-blue-500 rounded-xl shadow-md overflow-y-auto max-h-[calc(100vh-100px)]">
            <h2 className="text-xl z-20 sticky top-0 text-center rounded-t-xl py-3 bg-[#FAF7F7] font-bold text-gray-800 mb-4">
              General Badges
            </h2>
            <div className="space-y-4 px-6">
              {[
                { title: "Persistent Pro" },
                { title: "Supreme Coder" },
                { title: "Debugger Knight" },
                { title: "Persistent Pro" },
                { title: "Logic Architect" },
                { title: "Persistent Pro" },
                { title: "Persistent Pro" },
                { title: "Persistent Pro" },
              ].map((badge, idx, arr) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between gap-4 py-2 ${
                    idx !== arr.length - 1 ? "border-b border-black" : ""
                  }`}
                >
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-800">
                      {badge.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Achieved 10,116 Points
                    </p>
                  </div>
                  <div className="relative w-28 h-28">
                    <img
                      src={badges2}
                      alt={badge.title}
                      className="w-full h-full opacity-80 object-contain rounded-md"
                    />
                    <div className="absolute top-1 right-1 bg-white/90 p-1 rounded-full shadow">
                      <Lock className="w-full h-full text-gray-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showBadgesModal && (
        <BadgesModal onClose={() => setShowBadgesModal(false)} />
      )}
    </>
  );
};
