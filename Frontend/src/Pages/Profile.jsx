import { useEffect, useState } from "react";
import { Copy, Lock, Settings, LogOut, Pencil } from "lucide-react";
import { BadgesModal, LogoutModel, SettingsModal } from "../models/index.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import config from "../../Config/config";
import { changeToBase64 } from "../Functions/toBase64.js";
import { groupDates } from "../Functions/groupDates.js";
import {
  ProfileSkeleton,
  CodeSnippetSkeleton,
  BadgeSkeleton,
  MiniBadge,
} from "../skeletons/index.js";
import AvatarsPrev from "../components/AvatarsPrev.jsx";

export const Profile = () => {
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
        <div className="bg-[#1e293b] relative text-white px-4 py-3 rounded-lg text-md mb-2 font-mono shadow hover:shadow-lg transition-all">
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
      <div className="min-h-screen bg-gray-100 md:px-8">
        <div className="flex flex-col gap-2 lg:flex-row">
          {/* Left Sidebar - Fixed */}
          <div className="flex flex-col items-center w-full pt-20 pb-5 mt-20 overflow-visible text-center bg-white border-2 border-blue-500 shadow-md lg:w-1/3 shadow-black rounded-2xl lg:sticky md:top-24 h-fit">
            {profileLoading ? (
              <ProfileSkeleton />
            ) : (
              <>
                {/* Profile Image - absolute overlap */}
                <div className="absolute -translate-x-1/2 -translate-y-1/2 lg:top-0 top-20 left-1/2">
                  <div className="relative">
                    {data?.data?.image ? (
                      <img
                        src={data?.data?.image}
                        alt="User avatar"
                        className="object-cover transition-all bg-gray-500 border-4 border-blue-500 rounded-full shadow-xl cursor-pointer w-36 h-36 hover:border-blue-600"
                      />
                    ) : (
                      <div className="object-cover transition-all bg-gray-100 border-4 border-blue-500 rounded-full shadow-xl cursor-pointer w-36 h-36 hover:border-blue-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="full"
                          height="full"
                          viewBox="0 -3 24 28"
                          fill="#ccc"
                          className="rounded-full"
                        >
                          <circle cx="12" cy="12" r="full" fill="#e5e7eb" />
                          <path
                            fill="#9ca3af"
                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                          />
                        </svg>
                      </div>
                    )}
                    {/* Pencil icon in bottom right corner */}
                    <div
                      onClick={() => setAvatars(true)}
                      className="absolute p-2 transition-colors bg-blue-500 rounded-full shadow-md cursor-pointer bottom-2 right-2 hover:bg-blue-600"
                    >
                      <Pencil className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {avatars && (
                  <AvatarsPrev
                    currentUser={currentUser?.data?.id}
                    setAvatars={setAvatars}
                  />
                )}
                <div className="absolute top-0 flex justify-between w-full p-4 md:p-6 lg:p-2">
                  <Settings
                    onClick={() => setsettingmodel(true)}
                    className="text-xs text-blue-500"
                  />
                  <LogOut
                    onClick={() => setLogoutmodel(true)}
                    className="text-xs text-red-400"
                  />
                </div>
                <div className="flex flex-col w-full gap-5 px-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {data?.data?.user_name}
                    </h2>
                    <p className="mb-4 text-gray-500 text-md">
                      {data?.data?.email}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-1 text-xl font-semibold text-gray-800">
                      Current Progress
                    </h3>
                    <p className="text-gray-600 text-md">
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
                        <div className="flex items-center justify-center w-20 h-20 text-sm bg-gray-200 rounded-full"></div>
                      )}

                      {/* Progress bar - always visible */}
                      <div className="relative flex-1 h-2 overflow-hidden bg-gray-300 rounded-full">
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

                    <p className="mb-1 text-lg text-gray-700">
                      You have{" "}
                      <strong className="font-extrabold text-black">
                        {scoreMap[activeTab]}{" "}
                      </strong>{" "}
                      Points
                    </p>
                    <p className="mb-6 text-sm text-gray-500">
                      Earn{" "}
                      {nextBadgeMap[activeTab]?.score - scoreMap[activeTab]}{" "}
                      points to {'"'}
                      {nextBadgeMap[activeTab]?.title}
                      {'"'} Badge
                    </p>
                  </div>
                </div>

                <div className="w-11/12 p-4 border border-gray-200 shadow-sm bg-gray-50 rounded-xl">
                  <div className="flex flex-col gap-3 font-medium text-gray-500 text-md">
                    <div className="flex justify-between">
                      <p>Total Executions</p>
                      <p className="font-bold text-black">
                        {errorsMap[activeTab] +
                          (data?.data?.successExec?.filter(
                            (exec) => exec.lang === activeTab.toLowerCase()
                          )?.length || 0)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-green-600">Successful Executions</p>
                      <p className="font-bold text-green-600">
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

          <div className="flex flex-col w-full gap-2 md:flex-row ">
            {/* Middle Section - Scrollable */}
            <div className="p-5 overflow-y-auto bg-white border-2 border-blue-500 shadow-md md:w-[60%] lg:w-3/4 shadow-black rounded-xl">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    Achievements &amp; Badges
                  </h2>
                </div>
                <div className="flex  bg-[#FAF7F7] items-center gap-4 p-4 rounded-lg min-h-28">
                  {(activeTab === "Python" ? pyUserBadges : sqlUserBadges)
                    ?.length > 0 ? (
                    (activeTab === "Python" ? pyUserBadges : sqlUserBadges).map(
                      (badge, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center transition-transform duration-300 bg-white border border-gray-200 shadow rounded-xl hover:shadow-md hover:scale-105"
                        >
                          <img
                            src={badge?.logo}
                            alt="badge"
                            className="h-24 w-28 "
                          />
                          <p className="w-full text-sm font-medium text-center text-gray-700">
                            {badge.title}
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-sm font-medium text-center text-gray-500">
                      No Achieved Badges
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Recent Successful Executions
                </h2>
                <div className="flex mt-2">
                  {["Python", "Sql"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`w-1/2 py-2 text-md font-semibold rounded-t-md transition-all duration-300 ${
                        activeTab === tab
                          ? "bg-[#FAF7F7] text-black border-t border-l border-r border-gray-300"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                    >
                      {`${tab === "Sql" ? tab.toUpperCase() : tab} (${
                        tab === "Python" ? pyExecs?.length : sqlExecs?.length
                      })`}
                    </button>
                  ))}
                </div>

                <div className="bg-[#FAF7F7] px-4 border-b border-l border-r border-gray-300 py-5 rounded-b-lg space-y-6">
                  {profileLoading ? (
                    [...Array(3)].map((_, index) => (
                      <CodeSnippetSkeleton key={index} />
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
                        <p className="text-sm font-medium text-gray-500">
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
                      <div key={dateStr} className="space-y-3">
                        <p className="text-sm font-medium text-gray-500">
                          {group.label}
                        </p>
                        {group.items.map((code, index) =>
                          renderCodeSnippet(code, index)
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      No executions found.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Scrollable */}
            <div className="sticky top-0 w-full max-h-screen overflow-y-auto bg-white border-2 border-blue-500 shadow-md md:w-[40%] lg:w-1/4 no-scrollbar shadow-black rounded-xl">
              <h2 className="text-xl z-20 sticky top-0 text-center rounded-t-xl py-3 bg-[#FAF7F7] font-bold text-gray-800 mb-4">
                All Badges
              </h2>
              <div className="px-3 space-y-4">
                {badgesLoading
                  ? [...Array(5)].map((_, index) => (
                      <BadgeSkeleton key={index} />
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
                          className={`flex items-center border-b justify-between gap-4 py-2`}
                        >
                          <div className="text-center">
                            <p className="text-xl font-bold text-gray-800">
                              {badge.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              Achieved on {badge.score} Points
                            </p>
                          </div>
                          <div className="relative w-28 h-28">
                            <img
                              src={badge?.logo}
                              alt={badge?.title}
                              className="object-contain w-full h-full rounded-md"
                            />
                            
                            {(badges?.length === 0 ||
                              badges?.every(
                                (bdg) => bdg?._id !== badge?._id
                              )) && (
                              <div className="absolute p-3 rounded-full shadow-xl top-8 right-8 bg-white/70">
                                <Lock className="w-full h-full text-gray-700" />
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
        <BadgesModal onClose={() => setShowBadgesModal(false)} />
      )}
      {isLogoutmodel && <LogoutModel onClose={() => setLogoutmodel(false)} />}

      {issettingmodel && (
        <SettingsModal onClose={() => setsettingmodel(false)} />
      )}
    </>
  );
};
