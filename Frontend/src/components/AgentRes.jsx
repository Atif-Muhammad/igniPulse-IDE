import React from "react";

function AgentRes({agentRes}) {
    if(!agentRes) return null;
  return (
    <div className="flex flex-col items-start justify-start w-full">
      {<div className="w-full h-full text-start px-3 tracking-wider">{agentRes?.text}</div>}
      {agentRes.example != "" && <strong className="w-full h-full text-start px-3  tracking-wider">Example: <br /> {agentRes?.example}</strong>}
    </div>
  );
}

export default AgentRes;
