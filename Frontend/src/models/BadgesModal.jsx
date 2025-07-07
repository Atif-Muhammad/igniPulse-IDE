import React from "react";
import { Lock, X } from "lucide-react";
export const BadgesModal = ({ onClose }) => {
  const pythonBadges = [
    { title: "Loop Master", img: "" },
    { title: "Function Pro", img: "" },
    { title: "Syntax Ninja", img: "" },
  ];

  const sqlBadges = [
    { title: "Query Champ", img: "" },
    { title: "Join Genius", img: "" },
    { title: "Index Expert", img: "" },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative w-full max-w-5xl mx-4 sm:mx-auto bg-gradient-to-br from-white via-gray-50 to-blue-100 rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-10 drop-shadow">
          🏅 All Achievements
        </h2>

        {/* Section: Python Badges */}
        <section className="mb-16">
          <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800 border-l-4 border-blue-600 pl-4 mb-8">
            Python Badges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pythonBadges.map((badge, index) => (
              <div
                key={index}
                className="group flex items-center justify-between gap-5 p-5 rounded-2xl bg-white shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200 hover:border-blue-400"
              >
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition">
                    {badge.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Achieved <span className="font-semibold">10,116</span>{" "}
                    Points
                  </p>
                </div>
                <div className="relative w-28 h-28 shrink-0">
                  <img
                    src={badge.img}
                    alt={badge.title}
                    className="w-full h-full object-contain opacity-95 rounded-xl shadow"
                  />
                  <div className="absolute top-1 right-1 bg-white/90 p-1 rounded-full shadow-md">
                    <Lock className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: SQL Badges */}
        <section>
          <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800 border-l-4 border-blue-600 pl-4 mb-8">
            SQL Badges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sqlBadges.map((badge, index) => (
              <div
                key={index}
                className="group flex items-center justify-between gap-5 p-5 rounded-2xl bg-white shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200 hover:border-blue-400"
              >
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition">
                    {badge.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Achieved <span className="font-semibold">10,116</span>{" "}
                    Points
                  </p>
                </div>
                <div className="relative w-28 h-28 shrink-0">
                  <img
                    src={badge.img}
                    alt={badge.title}
                    className="w-full h-full object-contain opacity-95 rounded-xl shadow"
                  />
                  <div className="absolute top-1 right-1 bg-white/90 p-1 rounded-full shadow-md">
                    <Lock className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
