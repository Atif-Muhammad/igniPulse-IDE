import React from "react";

function LinearLoader() {
  return (
    <div className="w-1/2 h-1 bg-gray-200 overflow-hidden relative rounded">
      <div className="absolute h-full w-1/3 bg-blue-500 animate-linearMove"></div>
    </div>
  );
}

export default LinearLoader;
