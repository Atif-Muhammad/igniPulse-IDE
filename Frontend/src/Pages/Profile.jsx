import { useEffect, useState } from "react";
import { Copy, Lock, Settings, LogOut, Pencil, Moon, Sun } from "lucide-react";
import { BadgesModal, LogoutModel, SettingsModal } from "../models/index.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import config from "../../Config/config";
import { groupDates } from "../Functions/groupDates.js";
import {
  ProfileSkeleton,
  CodeSnippetSkeleton,
  BadgeSkeleton,
} from "../skeletons/index.js";
import AvatarsPrev from "../components/AvatarsPrev.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export const Profile = () => {
  const { darkTheme, toggleTheme } = useTheme();
  const [pyExecs, setPyExecs] = useState([]);
  const [sqlExecs, setSqlExecs] = useState([]);
  const [pyUserBadges, setPyUserBadges] = useState([]);
  const [sqlUserBadges, setSqlUserBadges] = useState([]);
  const [badges, setBadges] = useState([]);
  const [avatars, setAvatars] = useState(false);
  const [expandedSnippets, setExpandedSnippets] = useState({});

  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Python");

  const [isLogoutmodel, setLogoutmodel] = useState(false);
  const [issettingmodel, setsettingmodel] = useState(false);

  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"]);

  // Dark mode classes
  const bgColor = darkTheme ? "bg-gray-900" : "bg-gray-100";
  const textColor = darkTheme ? "text-gray-200" : "text-gray-800";
  const cardBg = darkTheme ? "bg-gray-800" : "bg-white";
  const borderColor = darkTheme ? "border-gray-700" : "border-blue-500";
  const secondaryBg = darkTheme ? "bg-gray-700" : "bg-gray-50";
  const secondaryText = darkTheme ? "text-gray-400" : "text-gray-600";
  const shadowColor = darkTheme ? "shadow-gray-800" : "shadow-black";
  const codeBg = darkTheme ? "bg-gray-800" : "bg-gray-900";
  const dividerColor = darkTheme ? "border-gray-600" : "border-gray-200";

  const { data: allBadges = [], isLoading: badgesLoading } = useQuery({
    queryKey: ["Badges", currentUser?.data?.id],
    queryFn: async () => await config.getBadges(),
    enabled: !!currentUser?.data?.id,
  });

  const {
    data = [],
    isSuccess,
    isLoading: profileLoading,
  } = useQuery({
    queryKey: ["profile", currentUser?.data?.id],
    queryFn: async () => await config.getProfile(currentUser?.data?.id),
    enabled: !!currentUser?.data?.id,
  });

  useEffect(() => {
    if (isSuccess) {
      setPyExecs(
        data?.data?.successExec?.filter((exec) => exec?.lang === "python") || []
      );
      setSqlExecs(
        data?.data?.successExec?.filter((exec) => exec?.lang === "sql") || []
      );

      setBadges(data?.data?.badges);

      setPyUserBadges(
        data?.data?.badges?.filter((bdg) => bdg.lang === "python")
      );
      setSqlUserBadges(data?.data?.badges?.filter((bdg) => bdg.lang === "sql"));
    }
  }, [data, isSuccess]);

  const execsMap = {
    Python: pyExecs || [],
    Sql: sqlExecs || [],
  };

  const errorsMap = {
    Python: data?.data?.errorExecPy,
    Sql: data?.data?.errorExecSql,
  };

  const userBadgesMap = {
    Python: pyUserBadges || [],
    Sql: sqlUserBadges || [],
  };

  const nextBadgeMap = {
    Python: data?.data?.nextBadgePy?.[0] || [],
    Sql: data?.data?.nextBadgeSql?.[0] || [],
  };

  const scoreMap = {
    Python: data?.data?.pyScore || 0,
    Sql: data?.data?.sqlScore || 0,
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const calculateProgressPercentage = () => {
    const currentScore = scoreMap[activeTab] || 0;
    const nextBadgeScore = nextBadgeMap[activeTab]?.score || 1;
    return Math.min(100, Math.max(0, (currentScore / nextBadgeScore) * 100));
  };

  const toggleCodeExpansion = (codeId) => {
    setExpandedSnippets((prev) => ({
      ...prev,
      [codeId]: !prev[codeId],
    }));
  };

  const renderCodeSnippet = (code, index) => {
    const codeId = `${code._id || index}`;
    const isExpanded = expandedSnippets[codeId];
    const lines = code.code.split("\n");
    const shouldTruncate = lines.length > 10;
    const displayLines =
      shouldTruncate && !isExpanded ? lines.slice(0, 10) : lines;

    return (
      <div key={index}>
        <div
          className={`${codeBg} relative text-white px-4 py-3 rounded-lg text-md mb-2 font-mono shadow hover:shadow-lg transition-all`}
        >
          <pre className="overflow-x-auto whitespace-pre-wrap">
            {displayLines.join("\n")}
            {shouldTruncate && !isExpanded && (
              <div className="pt-2 text-gray-400">...</div>
            )}
          </pre>
          <div className="absolute flex gap-2 top-2 right-2">
            <button
              onClick={() => copyToClipboard(code.code)}
              className="text-gray-400 cursor-pointer hover:text-white"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {shouldTruncate && (
            <button
              onClick={() => toggleCodeExpansion(codeId)}
              className="absolute text-sm text-blue-300 bottom-2 right-2 hover:text-blue-300"
            >
              {isExpanded ? "Show Less" : "See More"}
            </button>
          )}
        </div>
      </div>
    );
  };

  const calculateExecutionRating = (successCount, errorCount) => {
    const total = successCount + errorCount;
    return total === 0
      ? "N/A"
      : `${Math.round((successCount / total) * 100)}% `;
  };

  return (
    <>
      <div className={`min-h-screen ${bgColor} md:px-8`}>
        <div className="flex flex-col gap-2 lg:flex-row">
          {/* Left Sidebar - Fixed */}
          <div
            className={`flex flex-col items-center w-full pt-20 pb-5 mt-20 overflow-visible text-center ${cardBg} border-2 ${borderColor} shadow-md lg:w-1/3 ${shadowColor} rounded-2xl lg:sticky md:top-24 h-fit`}
          >
            {profileLoading ? (
              <ProfileSkeleton darkTheme={darkTheme} />
            ) : (
              <>
                {/* Profile Image - absolute overlap */}
                <div className="absolute -translate-x-1/2 -translate-y-1/2 lg:top-0 top-20 left-1/2">
                  <div className="relative">
                    {data?.data?.image ? (
                      <img
                        src={data?.data?.image}
                        alt="User avatar"
                        className={`object-cover transition-all bg-gray-500 border-4 ${
                          darkTheme ? "border-blue-600" : "border-blue-500"
                        } rounded-full shadow-xl cursor-pointer w-36 h-36 hover:${
                          darkTheme ? "border-blue-500" : "border-blue-600"
                        }`}
                      />
                    ) : (
                      <div
                        className={`object-cover transition-all ${
                          darkTheme ? "bg-gray-700" : "bg-gray-100"
                        } border-4 ${
                          darkTheme ? "border-blue-600" : "border-blue-500"
                        } rounded-full shadow-xl cursor-pointer w-36 h-36 hover:${
                          darkTheme ? "border-blue-500" : "border-blue-600"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="full"
                          height="full"
                          viewBox="0 -3 24 28"
                          fill={darkTheme ? "#9ca3af" : "#ccc"}
                          className="rounded-full"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="full"
                            fill={darkTheme ? "#374151" : "#e5e7eb"}
                          />
                          <path
                            fill={darkTheme ? "#6b7280" : "#9ca3af"}
                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                          />
                        </svg>
                      </div>
                    )}
                    {/* Pencil icon in bottom right corner */}
                    <div
                      onClick={() => setAvatars(true)}
                      className={`absolute p-2 transition-colors ${
                        darkTheme ? "bg-blue-600" : "bg-blue-500"
                      } rounded-full shadow-md cursor-pointer bottom-2 right-2 hover:${
                        darkTheme ? "bg-blue-500" : "bg-blue-600"
                      }`}
                    >
                      <Pencil className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {avatars && (
                  <AvatarsPrev
                    currentUser={currentUser?.data?.id}
                    setAvatars={setAvatars}
                    darkTheme={darkTheme}
                  />
                )}
                <div className="absolute top-0 flex justify-between w-full p-4 md:p-6 lg:p-2">
                  <div className="flex gap-5">
                    <Settings
                      onClick={() => setsettingmodel(true)}
                      className={`text-xs ${
                        darkTheme ? "text-blue-400" : "text-blue-500"
                      }`}
                    />
                    {darkTheme ? (
                      <Sun
                        onClick={toggleTheme}
                        className={`text-xs ${
                          darkTheme ? "text-yellow-300" : "text-blue-500"
                        } cursor-pointer`}
                      />
                    ) : (
                      <Moon
                        onClick={toggleTheme}
                        className={`text-xs ${
                          darkTheme ? "text-yellow-300" : "text-blue-500"
                        } cursor-pointer`}
                      />
                    )}
                  </div>
                  <LogOut
                    onClick={() => setLogoutmodel(true)}
                    className="text-xs text-red-400"
                  />
                </div>
                <div className="flex flex-col w-full gap-5 px-4">
                  <div>
                    <h2 className={`text-2xl font-bold ${textColor}`}>
                      {data?.data?.user_name || "No Name"}
                    </h2>

                    <p className={`mb-4 ${secondaryText} text-md`}>
                      {data?.data?.email}
                    </p>
                  </div>

                  <div>
                    <p className={`${textColor} text-lg`}>
                      {userBadgesMap[activeTab]?.[0]?.title ??
                        "Run your first code to unlock!"}
                    </p>

                    <div className="flex items-center justify-between gap-2 mb-4">
                      {/* Conditionally render left badge */}
                      {userBadgesMap[activeTab]?.[0]?.logo ? (
                        <img
                          src={userBadgesMap[activeTab]?.[0]?.logo}
                          className="w-20 h-20"
                          alt="Current badge"
                        />
                      ) : (
                        <div
                          className={`flex items-center justify-center w-20 h-20 text-sm ${
                            darkTheme ? "bg-gray-700" : "bg-gray-200"
                          } rounded-full`}
                        >
                          No Achieve Badges
                        </div>
                      )}

                      {/* Progress bar - always visible */}
                      <div
                        className={`relative flex-1 h-2 overflow-hidden ${
                          darkTheme ? "bg-gray-600" : "bg-gray-300"
                        } rounded-full`}
                      >
                        <div
                          className="absolute top-0 left-0 h-2 transition-all duration-700 ease-in-out bg-red-500 rounded-full"
                          style={{ width: `${calculateProgressPercentage()}%` }}
                        ></div>
                      </div>

                      {/* Next badge - always visible (assuming there's always a next badge) */}
                      <img
                        src={
                          nextBadgeMap[activeTab]?.logo || "/default-badge.png"
                        }
                        className="w-20 h-20"
                        alt="Next badge"
                      />
                    </div>

                    <p className={`mb-1 text-lg ${secondaryText}`}>
                      You have{" "}
                      <strong className={`font-extrabold ${textColor}`}>
                        {scoreMap[activeTab]}{" "}
                      </strong>{" "}
                      Points
                    </p>
                    <p className={`mb-6 text-sm ${secondaryText}`}>
                      Earn{" "}
                      {nextBadgeMap[activeTab]?.score - scoreMap[activeTab]}{" "}
                      points to {'"'}
                      {nextBadgeMap[activeTab]?.title}
                      {'"'} Badge
                    </p>
                  </div>
                </div>

                <div
                  className={`w-11/12 p-4 border ${dividerColor} shadow-sm ${secondaryBg} rounded-xl`}
                >
                  <div
                    className={`flex flex-col gap-3 font-medium ${secondaryText} text-md`}
                  >
                    <div className="flex justify-between">
                      <p>Total Executions</p>
                      <p className={`font-bold ${textColor}`}>
                        {errorsMap[activeTab] +
                          (data?.data?.successExec?.filter(
                            (exec) => exec.lang === activeTab.toLowerCase()
                          )?.length || 0)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-green-500">Successful Executions</p>
                      <p className="font-bold text-green-500">
                        {execsMap[activeTab]?.length || 0}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-red-500">Error Executions</p>
                      <p className="font-bold text-red-500">
                        {errorsMap[activeTab] || 0}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-blue-500">Success Rate</p>
                      <p className="font-bold text-blue-500">
                        {calculateExecutionRating(
                          execsMap[activeTab]?.length || 0,
                          errorsMap[activeTab] || 0
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col w-full gap-2 md:flex-row">
            {/* Middle Section - Scrollable */}
            <div
              className={`p-5 overflow-y-auto ${cardBg} border-2 ${borderColor} shadow-md md:w-[60%] lg:w-3/4 ${shadowColor} rounded-xl`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl font-bold ${textColor}`}>
                    Achievements & Badges
                  </h2>
                </div>

                <div
                  className={`flex justify-between items-center w-full gap-4 ${secondaryBg} p-4 rounded-lg min-h-28`}
                >
                  {(activeTab === "Python" ? pyUserBadges : sqlUserBadges)
                    ?.slice(
                      0,
                      window.innerWidth >= 1024
                        ? 5
                        : window.innerWidth >= 768
                        ? 3
                        : 2
                    )
                    .map((badge, index) => (
                      <div
                        key={index}
                        className={`flex flex-col items-center transition-transform duration-300 ${cardBg} border ${dividerColor} shadow rounded-xl hover:shadow-md hover:scale-105`}
                      >
                        <img
                          src={badge?.logo}
                          alt="badge"
                          className="h-24 w-28"
                        />
                        <p
                          className={`w-full text-sm font-medium text-center ${secondaryText}`}
                        >
                          {badge.title}
                        </p>
                      </div>
                    ))}

                  {(activeTab === "Python" ? pyUserBadges : sqlUserBadges)
                    ?.length >
                    (window.innerWidth >= 1024
                      ? 5
                      : window.innerWidth >= 768
                      ? 3
                      : 2) && (
                    <button
                      className={`cursor-pointer flex flex-col items-center justify-center h-24 w-28 transition-transform duration-300 ${cardBg} border border-dashed ${dividerColor} shadow rounded-xl hover:shadow-md hover:scale-105 ${secondaryText}`}
                      onClick={() => setShowBadgesModal(true)}
                    >
                      See All
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h2 className={`text-xl font-bold ${textColor}`}>
                  Recent Successful Executions
                </h2>
                <div className="flex mt-2">
                  {["Python", "Sql"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`w-1/2 py-2 text-md font-semibold rounded-t-md transition-all duration-300 ${
                        activeTab === tab
                          ? // Active tab styles
                            `${darkTheme ? "bg-gray-700" : "bg-gray-100"} ${
                              darkTheme ? "text-white" : "text-gray-800"
                            } border-t border-l border-r ${
                              darkTheme ? "border-gray-600" : "border-gray-300"
                            }`
                          : // Inactive tab styles
                            `${
                              darkTheme
                                ? "bg-gray-800 text-gray-400 border-t  hover:bg-gray-700 hover:text-gray-300"
                                : "bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700"
                            }`
                      }`}
                    >
                      {`${tab === "Sql" ? tab.toUpperCase() : tab} (${
                        tab === "Python" ? pyExecs?.length : sqlExecs?.length
                      })`}
                    </button>
                  ))}
                </div>

                <div
                  className={`${secondaryBg} px-4 border-b border-l border-r ${dividerColor} py-5 rounded-b-lg space-y-6`}
                >
                  {profileLoading ? (
                    [...Array(3)].map((_, index) => (
                      <CodeSnippetSkeleton key={index} darkTheme={darkTheme} />
                    ))
                  ) : activeTab === "Python" && pyExecs?.length > 0 ? (
                    Object.entries(
                      pyExecs.reduce((groups, code) => {
                        const { label, dateStr } = groupDates(code?.createdAt);
                        if (!groups[dateStr]) {
                          groups[dateStr] = {
                            label,
                            items: [],
                          };
                        }
                        groups[dateStr].items.push(code);
                        return groups;
                      }, {})
                    ).map(([dateStr, group]) => (
                      <div key={dateStr} className="space-y-3">
                        <p className={`text-sm font-medium ${secondaryText}`}>
                          {group.label}
                        </p>
                        {group.items.map((code, index) =>
                          renderCodeSnippet(code, index)
                        )}
                      </div>
                    ))
                  ) : activeTab === "Sql" && sqlExecs?.length > 0 ? (
                    Object.entries(
                      sqlExecs.reduce((groups, code) => {
                        const { label, dateStr } = groupDates(code?.createdAt);
                        if (!groups[dateStr]) {
                          groups[dateStr] = {
                            label,
                            items: [],
                          };
                        }
                        groups[dateStr].items.push(code);
                        return groups;
                      }, {})
                    ).map(([dateStr, group]) => (
                      <div key={dateStr} className="space-y-3  ">
                        <p className={`text-sm font-medium ${secondaryText}`}>
                          {group.label}
                        </p>
                        {group.items.map((code, index) =>
                          renderCodeSnippet(code, index)
                        )}
                      </div>
                    ))
                  ) : (
                    <p className={`text-center ${secondaryText}`}>
                      No executions found.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Scrollable */}
            <div
              className={`sticky top-0 w-full max-h-screen overflow-y-auto ${cardBg} border-2 ${borderColor} shadow-md md:w-[40%] lg:w-1/4 custom-scrollbar ${shadowColor} rounded-xl`}
            >
              <h2
                className={`text-xl z-20 sticky top-0 text-center rounded-t-xl py-3 ${secondaryBg} font-bold ${textColor} mb-4`}
              >
                All Badges
              </h2>
              <div className="px-3 space-y-4">
                {badgesLoading
                  ? [...Array(5)].map((_, index) => (
                      <BadgeSkeleton key={index} darkTheme={darkTheme} />
                    ))
                  : allBadges &&
                    allBadges
                      ?.filter(
                        (bdg) =>
                          bdg.lang?.toLowerCase() === activeTab.toLowerCase()
                      )
                      ?.map((badge, index) => (
                        <div
                          key={index}
                          className={`flex items-center border-b ${dividerColor} justify-between gap-4 py-2`}
                        >
                          <div className="text-center">
                            <p className={`text-xl font-bold ${textColor}`}>
                              {badge.title}
                            </p>
                            <p className={`text-sm ${secondaryText}`}>
                              Achieved on {badge.score} Points
                            </p>
                          </div>
                          <div className="relative w-28 h-28">
                            <img
                              src={badge?.logo}
                              alt={badge?.title}
                              className={`object-contain w-full h-full rounded-md transition-opacity duration-300 ${
                                badges?.length === 0 ||
                                badges?.every((bdg) => bdg?._id !== badge?._id)
                                  ? "opacity-90"
                                  : "opacity-100"
                              }`}
                            />

                            {(badges?.length === 0 ||
                              badges?.every(
                                (bdg) => bdg?._id !== badge?._id
                              )) && (
                              <div
                                className={`absolute top-2 right-2 p-1.5 rounded-full ${
                                  darkTheme ? "bg-gray-600/80" : "bg-white/80"
                                } shadow-lg`}
                              >
                                <Lock
                                  className={`w-5 h-5 ${
                                    darkTheme
                                      ? "text-gray-300"
                                      : "text-gray-700"
                                  }`}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBadgesModal && (
        <BadgesModal
          pyUserBadges={pyUserBadges}
          sqlUserBadges={sqlUserBadges}
          onClose={() => setShowBadgesModal(false)}
          darkTheme={darkTheme}
        />
      )}
      {isLogoutmodel && (
        <LogoutModel
          onClose={() => setLogoutmodel(false)}
          darkTheme={darkTheme}
        />
      )}

      {issettingmodel && (
        <SettingsModal
          onClose={() => setsettingmodel(false)}
          darkTheme={darkTheme}
        />
      )}
    </>
  );
};
