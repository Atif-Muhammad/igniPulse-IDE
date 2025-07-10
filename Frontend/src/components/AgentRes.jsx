import React from "react";

function AgentRes({ agentRes }) {
  if (!agentRes) return null;
  // console.log(agentRes);

  return (
    <div className="flex flex-col items-start no-scrollbar  justify-start w-full h-full  overflow-y-auto ">
      <div className="w-full text-start  tracking-wider">{agentRes?.text}</div>
      {agentRes.example !== "" && (
        <strong className="w-full text-start px-3 tracking-wider mt-2">
          Example: <br /> {agentRes?.example}
        </strong>
      )}
    </div>
  );
}

export default AgentRes;
