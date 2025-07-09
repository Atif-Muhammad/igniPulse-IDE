import { useEffect, useState } from "react";
import { Copy, Lock, Settings, LogOut } from "lucide-react";
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
    // console.log("data:",data)
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

  return (
    <>
      <div className="p-4 md:px-8 py-12 bg-gray-100 min-h-screen">
        <div className="flex flex-col  md:flex-row gap-2">
          {/* Left Sidebar - Fixed */}
          <div className="md:w-1/4 w-full mt-10 bg-white shadow-black border-2 border-blue-500 rounded-2xl shadow-md flex flex-col items-center text-center  overflow-visible pb-5 pt-20 md:sticky md:top-24 h-fit">
            {profileLoading ? (
              <ProfileSkeleton />
            ) : (
              <>
                {/* Profile Image - absolute overlap */}
                <div
                  onClick={() => setAvatars(true)}
                  className="absolute md:top-0 top-20 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  {data?.data?.image ? (
                    <img
                      src={data?.data?.image}
                      alt="User avatar"
                      className="w-36 h-36 rounded-full object-cover bg-gray-500 border-4 border-blue-500 shadow-xl cursor-pointer hover:border-blue-600 transition-all"
                    />
                  ) : (
                    <div
                      onClick={() => setAvatars(true)}
                      className="w-36 h-36 rounded-full object-cover bg-gray-100 border-4 border-blue-500 shadow-xl cursor-pointer hover:border-blue-600 transition-all"
                    >
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
                </div>

                {avatars && (
                  <AvatarsPrev
                    currentUser={currentUser?.data?.id}
                    setAvatars={setAvatars}
                  />
                )}
                <div className=" flex absolute top-0  justify-between w-full p-2 ">
                  <Settings
                    onClick={() => setsettingmodel(true)}
                    className="text-xs text-blue-500"
                  />
                  <LogOut
                    onClick={() => setLogoutmodel(true)}
                    className="text-xs text-red-400"
                  />
                </div>
                <div className=" w-full px-4 flex flex-col gap-5 ">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {data?.data?.user_name}
                    </h2>
                    <p className="text-md text-gray-500 mb-4">
                      {data?.data?.email}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      Current Progress
                    </h3>
                    <p className="text-md text-gray-600">
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
                        <div className="w-20 bg-gray-200 flex items-center text-sm justify-center rounded-full h-20"></div>
                      )}

                      {/* Progress bar - always visible */}
                      <div className="flex-1 bg-gray-300 rounded-full h-2 overflow-hidden relative">
                        <div
                          className="absolute top-0 left-0 bg-red-500 h-2 rounded-full transition-all duration-700 ease-in-out"
                          style={{ width: `${calculateProgressPercentage()}%` }}
                        ></div>
                      </div>

                      {/* Next badge - always visible (assuming there's always a next badge) */}
                      <img
                        src={
                          nextBadgeMap[activeTab]?.logo || "/default-badge.png"
                        } // Fallback image if needed
                        className="w-20 h-20"
                        alt="Next badge"
                      />
                    </div>

                    <p className="text-lg text-gray-700 mb-1">
                      You have{" "}
                      <strong className="font-extrabold text-black">
                        {scoreMap[activeTab]}{" "}
                      </strong>{" "}
                      Points
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                      Earn{" "}
                      {nextBadgeMap[activeTab]?.score - scoreMap[activeTab]}{" "}
                      points to {'"'}
                      {nextBadgeMap[activeTab]?.title}
                      {'"'} Badge
                    </p>
                  </div>
                </div>

                <div className="w-11/12 bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-4">
                  <div className="flex flex-col gap-3 text-md text-gray-500 font-medium">
                    <div className="flex justify-between">
                      <p>Total Executions</p>
                      <p className="text-black font-bold">
                        {data?.data?.totalExec -
                          data?.data?.successExec?.filter(
                            (exec) => exec.lang != activeTab.toLowerCase()
                          )?.length || 0}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-green-600">Successful</p>
                      <p className="text-green-600 font-bold">
                        {execsMap[activeTab]?.length || 0}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-red-500">Errors</p>
                      <p className="text-red-500 font-bold">
                        {errorsMap[activeTab] || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Middle Section - Scrollable */}
          <div className="md:w-1/2 bg-white border-2 shadow-black border-blue-500 rounded-xl shadow-md p-5 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-xl  text-gray-800">
                  Achievements &amp; Badges
                </h2>
              </div>
              <div className="flex justify-center bg-[#FAF7F7] items-center gap-4 p-4 rounded-lg min-h-28">
                {(activeTab === "Python" ? pyUserBadges : sqlUserBadges)
                  ?.length > 0 ? (
                  (activeTab === "Python" ? pyUserBadges : sqlUserBadges).map(
                    (badge, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 shadow hover:shadow-md hover:scale-105 transition-transform duration-300"
                      >
                        <img
                          src={badge?.logo}
                          alt="badge"
                          className="w-20 h-18 mb-2"
                        />
                        <p className="text-sm font-medium text-gray-700 text-center">
                          {badge.title}
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-gray-500 text-center font-medium">
                    No Achieved Badges
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="font-bold text-gray-800 text-xl">
                Recent Successful Executions
              </h2>
              <div className="mt-2 flex">
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
                  // Group executions by date
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
                      {/* Only show date label once at the top */}
                      <p className="text-sm text-gray-500 font-medium">
                        {group.label}
                      </p>
                      {/* Render all items for this date group */}
                      {group.items.map((code, index) => (
                        <div key={index}>
                          <div className="bg-[#1e293b] relative z-10 text-white px-4 py-3 rounded-lg text-md mb-2 flex justify-between items-center font-mono shadow hover:shadow-lg transition-all">
                            <span className="whitespace-pre-wrap">
                              {code.code}
                            </span>

                            <button
                              onClick={() => copyToClipboard(code.code)}
                              className="text-gray-400 absolute top-4 right-4 cursor-pointer hover:text-white"
                              title="Copy to clipboard"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                ) : activeTab === "Sql" && sqlExecs?.length > 0 ? (
                  // Same grouping logic for SQL
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
                      <p className="text-sm text-gray-500 font-medium">
                        {group.label}
                      </p>
                      {group.items.map((code, index) => (
                        <div key={index}>
                          <div className="bg-[#1e293b] text-white px-4 py-3 rounded-lg text-sm mb-2 flex justify-between items-center font-mono shadow hover:shadow-lg transition-all">
                            <span>{code.code}</span>
                            <button
                              onClick={() => copyToClipboard(code.code)}
                              className="text-gray-400 cursor-pointer hover:text-white"
                              title="Copy to clipboard"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
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
          <div className="md:w-1/4 w-full sticky top-12 no-scrollbar bg-white border-2 shadow-black border-blue-500 rounded-xl shadow-md overflow-y-auto max-h-[calc(100vh-100px)]">
            <h2 className="text-xl z-20 sticky top-0 text-center rounded-t-xl py-3 bg-[#FAF7F7] font-bold text-gray-800 mb-4">
              All Badges
            </h2>
            <div className="space-y-4 px-6">
              {badgesLoading
                ? [...Array(5)].map((_, index) => <BadgeSkeleton key={index} />)
                : allBadges &&
                  allBadges
                    ?.filter(
                      (bdg) =>
                        bdg.lang?.toLowerCase() === activeTab.toLowerCase()
                    )
                    ?.map((badge, index) => (
                      <div
                        key={index}
                        className={`flex items-center border-b justify-between gap-4 py-2 `}
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
                            className="w-full h-full object-contain rounded-md"
                          />
                          {(badges?.length === 0 ||
                            badges?.some((bdg) => bdg?._id !== badge?._id)) && (
                            <div className="absolute top-8 right-8 bg-white/70 p-3 rounded-full shadow-xl">
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

      {showBadgesModal && (
        <BadgesModal onClose={() => setShowBadgesModal(false)} />
      )}
      {isLogoutmodel && <LogoutModel onClose={() => setLogoutmodel(false)}/>}

      {issettingmodel && (
        <SettingsModal onClose={() => setsettingmodel(false)} />
      )}
    </>
  );
};
