import { useEffect, useState } from "react";
import { Copy, Lock } from "lucide-react";
import { BadgesModal } from "../models/BadgesModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import config from "../../Config/config";
import { changeToBase64 } from "../Functions/toBase64.js";
import { groupDates } from "../Functions/groupDates.js";

export const Profile = () => {
  const [pyExecs, setPyExecs] = useState([]);
  const [sqlExecs, setSqlExecs] = useState([]);
  const [pyUserBadges, setPyUserBadges] = useState([]);
  const [sqlUserBadges, setSqlUserBadges] = useState([]);
  const [badges, setBadges] = useState([]);

  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Python");
  
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"]);

  const { data: allBadges = [] } = useQuery({
    queryKey: ["Badges", currentUser?.data?.id],
    queryFn: async () => await config.getBadges(),
    enabled: !!currentUser?.data?.id,
  });

  const { data = [], isSuccess } = useQuery({
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
    Python: data?.data?.pyScore || [],
    Sql: data?.data?.sqlScore || [],
  };

  

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
  };

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
                src={data?.data?.image}
                alt="User avatar"
                className="w-36 h-36 rounded-full object-cover bg-gray-500 border-4 border-blue-500 shadow-xl"
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
                <p className="text-md text-gray-600 ">
                  {
                    userBadgesMap[activeTab]?.[0]?.title
                  }
                </p>

                <div className="flex items-center  justify-between gap-2 mb-4">
                  <img
                    src={userBadgesMap[activeTab]?.[0]?.logo}
                    className="w-20 h-20"
                    alt="Star icon"
                  />
                  <div className="flex-1 bg-gray-300 rounded-full h-2 overflow-hidden relative">
                    <div
                      className="absolute top-0 left-0 bg-red-500 h-2 rounded-full transition-all duration-700 ease-in-out"
                      style={{ width: "84%" }}
                    ></div>
                  </div>
                  <img
                    src={nextBadgeMap[activeTab]?.logo}
                    className="w-20 h-20"
                    alt="Star icon"
                  />
                </div>

                <p className="text-lg text-gray-700 mb-1">
                  You have{" "}
                  <strong className="font-extrabold text-black">
                    {scoreMap[activeTab] || 0}{" "}
                  </strong>{" "}
                  Points
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Earn{" "}
                  {nextBadgeMap[activeTab]?.score - scoreMap[activeTab]}
                  points to{" "}
                  {nextBadgeMap[activeTab]?.[0]?.title}
                  Badge
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
                {(activeTab === "Python" ? pyUserBadges : sqlUserBadges)?.map(
                  (badge, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 shadow hover:shadow-md hover:scale-105 transition-transform duration-300"
                    >
                      <img
                        src={badge?.logo}
                        alt="badge"
                        className="w-10 h-10 mb-2"
                      />
                      <p className="text-xs font-medium text-gray-700 text-center">
                        {badge.title}
                      </p>
                    </div>
                  )
                )}
                {(activeTab === "Python" ? pyUserBadges : sqlUserBadges)
                  ?.length > 3 && (
                  <button
                    onClick={() => setShowBadgesModal(true)}
                    className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow self-center"
                  >
                    See All
                  </button>
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
                    {`${tab} (${
                      tab === "Python" ? pyExecs?.length : sqlExecs?.length
                    })`}
                  </button>
                ))}
              </div>

              <div className="bg-[#FAF7F7] px-4 border-b border-l border-r border-gray-300 py-5 rounded-b-lg space-y-6">
                {activeTab === "Python" && pyExecs?.length > 0 && (
                  <>
                    {pyExecs?.map((code, index) => (
                      <div key={index} className="space-y-3">
                        <p className="text-sm text-gray-500 font-medium">
                          {groupDates(code?.createdAt)}
                        </p>
                        <div className="bg-[#1e293b] text-white px-4 py-3 rounded-lg text-sm mb-2 flex justify-between items-center font-mono shadow hover:shadow-lg transition-all">
                          <span>{code.code}</span>
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
                    ))}
                  </>
                )}

                {activeTab === "Sql" && sqlExecs?.length > 0 && (
                  <>
                    {sqlExecs?.map((code, index) => (
                      <div key={index} className="space-y-3">
                        <p className="text-sm text-gray-500 font-medium">
                          {groupDates(code?.createdAt)}
                        </p>
                        <div className="bg-[#1e293b] text-white px-4 py-3 rounded-lg text-sm mb-2 flex justify-between items-center font-mono shadow hover:shadow-lg transition-all">
                          <span>{code.code}</span>
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
                    ))}
                  </>
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
              {allBadges &&
                allBadges
                  ?.filter(
                    (bdg) => bdg.lang?.toLowerCase() === activeTab.toLowerCase()
                  )
                  ?.map((badge, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between gap-4 py-2 `}
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
                        {badges?.some((bdg) => bdg?._id != badge?._id) && (
                          <div className="absolute top-8 right-8 bg-white p-3 rounded-full shadow-xl">
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
    </>
  );
};
