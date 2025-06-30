import React, { useEffect, useState } from "react";
import { BadgeCheck, Copy } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import config from "../../Config/config";
import AOS from "aos";
import "aos/dist/aos.css";
import AvatarsPrev from "../components/AvatarsPrev";
import { changeToBase64 } from "../Functions/toBase64";

export const Profile = () => {
  const [execs, setExecs] = useState([]);
  const [dispAvatars, setDispAvatars] = useState(false);
  const [targetScore, setTargetScore] = useState(0);
  const [badges, setBadges] = useState([])
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"]);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const { data } = useQuery({
    queryKey: ["profile", currentUser?.data?.id],
    queryFn: async () => await config.getProfile(currentUser?.data?.id),
    enabled: !!currentUser?.data?.id,
  });

  useEffect(() => {
    // console.log(data?.data)
    setExecs(data?.data?.successExec || []);
    setTargetScore(data?.data?.nextBadge[0]?.score - data?.data?.score);
    setBadges(data?.data?.badges);
  }, [data]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <>
      <div className="max-w-6xl h-screen mx-auto px-6 py-10 flex flex-col md:flex-row md:items-start gap-2">
        {/* Left Profile Card */}
        <div className=" h-[75vh] flex md:sticky md:top-5 items-center md:w-1/3 w-full">
          <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl pt-16 pb-8 px-8 w-full flex flex-col items-center text-center border-2 border-blue-500 ">
            {/* Profile Image - overlapping top */}
            <div className="absolute z-20 -top-14">
              {data?.data?.image ? (
                <img
                  src={data?.data?.image}
                  alt=""
                  className="w-28 h-28 rounded-full border-4 border-blue-500 shadow-lg object-cover bg-white"
                />
              ) : (
                <div onClick={()=> setDispAvatars(!dispAvatars)} className="w-28 h-28 rounded-full border-4 border-blue-500 shadow-lg object-cover bg-white break-words">
                  pencil icon dalta wachwa talaqa
                </div>
              )}
            </div>

            {/* Username & Email */}
            <h2 className="text-2xl font-extrabold text-gray-800 mb-1 mt-4">
              {data?.data?.user_name}
            </h2>
            <p className="text-gray-500 text-sm mb-6">{data?.data?.email}</p>

            {/* Current Badge label */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Current Badge
              </span>
            </div>

            {/* Badges + Progress Bar */}
            <div className="flex items-center w-full justify-between mb-4">
              <img
                src={`${changeToBase64(data?.data?.badges[0]?.logo?.data?.data)}`}
                alt="current badge"
                className="w-6 h-6"
              />
              <div className="flex-1 mx-2 bg-gray-200 rounded-full h-3 overflow-hidden relative">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full w-[75%]"></div>
              </div>
              <img
                src={`${changeToBase64(data?.data?.nextBadge[0]?.logo?.data?.data)}`}
                alt="next badge"
                className="w-6 h-6 rounded-md"
              />
            </div>

            {/* Points */}
            <p className="text-gray-800 text-sm mb-2 font-medium">
              You have {data?.data?.score || 0} Points
            </p>
            <p className="text-xs text-gray-500 mb-8 italic">
              Earn {targetScore} points to {data?.data?.nextBadge[0]?.title} badge rank
            </p>

            {/* Execution Counters */}
            <div className="w-full bg-white rounded-2xl p-5 border border-gray-300 shadow-sm">
              <div className="flex justify-between mb-3">
                <span className="text-gray-600 text-sm font-medium">
                  Total Executions
                </span>
                <span className="font-bold text-gray-800">
                  {data?.data?.totalExec || 0}
                </span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-green-600 text-sm font-medium">
                  Successful
                </span>
                <span className="font-bold text-green-600">
                  {data?.data?.successExec?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-500 text-sm font-medium">Errors</span>
                <span className="font-bold text-red-500">
                  {data?.data?.errorExec || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 flex-1 border-2 border-blue-500 flex flex-col">
          {/* Achievements */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Achievements & Badges
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {badges?.map((badge, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 shadow hover:shadow-md hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={`${changeToBase64(badge?.logo?.data?.data)}`}
                    alt="badge"
                    className="w-10 h-10 mb-2"
                  />
                  <p className="text-xs font-medium text-gray-700 text-center">
                    {badge.title}
                  </p>
                </div>
              ))}
             {badges?.length > 3 && <button className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow self-center">
                See All
              </button>}
            </div>
          </div>

          {/* Recent Successful Executions */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Recent Successful Executions
            </h3>

            <div className="flex flex-col gap-4">
              {execs?.map((code, index) => (
                <div
                  key={index}
                  data-aos="fade-up"
                  className="relative rounded-2xl bg-gray-900 text-white p-5 shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <button
                    onClick={() => handleCopy(code)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                    title="Copy Code"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed">
                    {code.code}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {dispAvatars && <AvatarsPrev currentUser={currentUser?.data?.id}/>}
    </>
  );
};
