import React from "react";
import { X } from "lucide-react";

const BadgesModal = ({ onClose, darkTheme, pyUserBadges, sqlUserBadges }) => {
  

  return (
    <div
      className={`fixed inset-0 ${
        darkTheme ? "bg-black/80" : "bg-black/60"
      } backdrop-blur-sm flex items-center justify-center z-50`}
    >
      <div
        className={`relative w-full max-w-5xl mx-4 sm:mx-auto rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto transition-all ${
          darkTheme
            ? "bg-gray-800"
            : "bg-gradient-to-br from-white via-gray-50 to-blue-100"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${
            darkTheme
              ? "text-gray-300 hover:text-white"
              : "text-gray-500 hover:text-black"
          } transition`}
        >
          <X className="w-6 h-6" />
        </button>

        <h2
          className={`text-4xl font-extrabold text-center mb-10 drop-shadow ${
            darkTheme ? "text-blue-400" : "text-blue-700"
          }`}
        >
          🏅 All Achievements
        </h2>

        <section className="mb-16">
          <h3
            className={`text-2xl sm:text-3xl font-semibold ${
              darkTheme ? "text-gray-200" : "text-gray-800"
            } border-l-4 ${
              darkTheme ? "border-blue-500" : "border-blue-600"
            } pl-4 mb-8`}
          >
            Python Badges
          </h3>
          <div className="flex flex-wrap gap-6">
            {pyUserBadges?.map((badge, index) => (
              <div
                key={index}
                className={`flex flex-col items-center transition-transform duration-300 border ${
                  darkTheme ? "border-gray-700" : "border-gray-200"
                } shadow rounded-xl hover:shadow-md hover:scale-105 ${
                  darkTheme ? "bg-gray-700" : "bg-white"
                }`}
              >
                <img src={badge?.logo} alt="badge" className="h-24 w-28" />

                <p
                  className={`w-full text-sm font-medium text-center ${
                    darkTheme ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {badge.title}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-16">
          <h3
            className={`text-2xl sm:text-3xl font-semibold ${
              darkTheme ? "text-gray-200" : "text-gray-800"
            } border-l-4 ${
              darkTheme ? "border-blue-500" : "border-blue-600"
            } pl-4 mb-8`}
          >
            SQL Badges
          </h3>
          <div className="flex flex-wrap gap-6">
            {sqlUserBadges?.map((badge, index) => (
              <div
                key={index}
                className={`flex flex-col items-center transition-transform duration-300 border ${
                  darkTheme ? "border-gray-700" : "border-gray-200"
                } shadow rounded-xl hover:shadow-md hover:scale-105 ${
                  darkTheme ? "bg-gray-700" : "bg-white"
                }`}
              >
                <img src={badge?.logo} alt="badge" className="h-24 w-28" />
                <p
                  className={`w-full text-sm font-medium text-center ${
                    darkTheme ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {badge.title}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BadgesModal;
