import React, { useEffect, useState } from "react";
import { BadgeCheck, Copy } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import config from "../../Config/config";
import AOS from "aos";
import "aos/dist/aos.css";

const mockUser = {
  username: "Ayesha Malik",
  avatar: "https://i.pravatar.cc/150?img=47",
  badges: ["Python Pro", "Top Performer", "Bug Squasher", "Fast Coder"],
  recentCodes: [
    `def greet(name):\n    print(f"Hello, {name}!")\n\ngreet("World")`,
    `def factorial(n):\n    return 1 if n == 0 else n * factorial(n - 1)\n\nprint(factorial(5))`,
    `for i in range(5):\n    print("Loop iteration:", i)`,
    `try:\n    num = int("abc")\nexcept ValueError:\n    print("Conversion failed")`,
  ],
};

export const Profile = () => {
  const [execs, setExecs] = useState([]);
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
    setExecs(data?.data?.successExec || []);
  }, [data]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="rounded-2xl bg-gradient-to-br from-white to-gray-100 shadow-xl p-6 md:p-8 transition-all">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-gray-200 pb-6">
          {/* Avatar & Username */}
          <div className="flex items-center gap-4">
            <img
              src={data?.data?.image}
              alt=""
              className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-md"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {data?.data?.user_name}
              </h2>
              <p className="text-sm text-gray-500">{data?.data?.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 text-center">
            <div>
              <p className="text-lg font-bold text-gray-800">
                {data?.data?.totalExec}
              </p>
              <p className="text-sm text-gray-500">Total Executions</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-600">
                {data?.data?.successExec?.length}
              </p>
              <p className="text-sm text-gray-500">Success</p>
            </div>
            <div>
              <p className="text-lg font-bold text-red-500">
                {data?.data?.errorExec}
              </p>
              <p className="text-sm text-gray-500">With Error</p>
            </div>
          </div>
        </div>

        {/* Badges as Cards with Icon on Top and Name Below */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Achievements & Badges
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mockUser.badges.map((badge, index) => (
              <div
                key={index}
                data-aos="fade-up"
                className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition"
              >
                <div className="bg-blue-100 text-blue-600 rounded-full p-3 mb-2">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <div className="text-center text-sm font-medium text-gray-700">
                  {badge}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Code Executions */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Successful Executions
          </h3>

          {execs?.map((code, index) => (
            <div
              key={index}
              data-aos="fade-up"
              className="relative rounded-lg overflow-hidden bg-gray-900 text-white p-4 mb-4"
            >
              <button
                onClick={() => handleCopy(code)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
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
  );
};
