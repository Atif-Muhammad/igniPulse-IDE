import React from "react";
import { BadgeCheck, Copy } from "lucide-react";

const mockUser = {
  username: "Ayesha Malik",
  avatar: "https://i.pravatar.cc/150?img=47",
  stats: {
    total: 75,
    success: 60,
    error: 15,
  },
  badges: ["Python Pro", "Top Performer", "Bug Squasher", "Fast Coder"],
  recentCodes: [
    `def greet(name):\n    print(f"Hello, {name}!")\n\ngreet("World")`,
    `def factorial(n):\n    return 1 if n == 0 else n * factorial(n - 1)\n\nprint(factorial(5))`,
    `for i in range(5):\n    print("Loop iteration:", i)`,
    `try:\n    num = int("abc")\nexcept ValueError:\n    print("Conversion failed")`,
  ],
};

export const Profile = () => {
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
              src={mockUser.avatar}
              alt="User Avatar"
              className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-md"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {mockUser.username}
              </h2>
              <p className="text-sm text-gray-500">Full Stack Developer</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 text-center">
            <div>
              <p className="text-lg font-bold text-gray-800">
                {mockUser.stats.total}
              </p>
              <p className="text-sm text-gray-500">Total Executions</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-600">
                {mockUser.stats.success}
              </p>
              <p className="text-sm text-gray-500">Success</p>
            </div>
            <div>
              <p className="text-lg font-bold text-red-500">
                {mockUser.stats.error}
              </p>
              <p className="text-sm text-gray-500">With Error</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-6 flex flex-wrap gap-3">
          {mockUser.badges.map((badge, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 hover:bg-blue-200 transition"
            >
              <BadgeCheck className="w-3 h-3" />
              {badge}
            </span>
          ))}
        </div>

        {/* Recent Code Executions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Successful Executions
          </h3>

          {mockUser.recentCodes.map((code, index) => (
            <div
              key={index}
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
                {code}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
