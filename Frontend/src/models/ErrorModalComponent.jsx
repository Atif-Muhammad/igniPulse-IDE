import React, { useState, useEffect, useRef } from "react";
import { HelpCircle, X, RefreshCw } from "lucide-react"; // Importing icons
import LinearLoader from "../components/Loaders/LinearLoader";
import AgentRes from "../components/AgentRes";

function ErrorModalComponent({
  isError,
  isPending,
  agentRes,
  handleAgentCall,
  setAgentRes,
}) {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const modalRef = useRef();
  const refreshRef = useRef(); // Add a ref for the refresh button

  const handleIconClick = () => {
    setShowErrorModal(true);
    handleAgentCall();
  };

  const handleClose = () => {
    setShowErrorModal(false);
    setAgentRes(null);
  };

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside modal AND not on refresh button
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        (!refreshRef.current || !refreshRef.current.contains(event.target))
      ) {
        handleClose();
      }
    };

    if (showErrorModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showErrorModal]);

  return (
    <>
      {isError && (
        <>
          {/* Floating Buttons Container */}
          <div className="absolute bottom-10 z-50 flex flex-col items-center gap-2 left-0 md:left-auto md:right-0">
            {showErrorModal ? (
              <>
                {/* Refresh Button */}
                <div
                  ref={refreshRef}
                  onClick={handleAgentCall}
                  className="bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700 sm:left-0"
                  title="Refresh"
                >
                  <RefreshCw size={18} />
                </div>
              </>
            ) : (
              <div
                onClick={handleIconClick}
                className="bg-black text-white text-xs px-3 py-2 flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-800"
              >
                <HelpCircle size={16} className="mr-1" />
                Need Help?
              </div>
            )}
          </div>

          {/* Modal */}
          {showErrorModal && (
            <div
              ref={modalRef}
              className="absolute bottom-10 right-0 md:right-10 z-50 md:w-80 w-68  max-w-sm backdrop-blur-lg bg-white/70 border border-blue-400 shadow-2xl rounded-2xl overflow-hidden animate-fadeInSlideUp"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-blue-100 border-b border-blue-300">
                <div className="flex items-center gap-2">
                  <HelpCircle className="text-blue-600" size={18} />
                  <h2 className="text-sm font-semibold text-blue-800">
                    AI Suggestions
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="text-blue-600 hover:text-red-600 transition-all duration-200"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-4 max-h-48 overflow-y-auto text-sm text-gray-800 custom-scrollbar">
                {isPending ? (
                  <div className="flex justify-center items-center h-full">
                    <LinearLoader />
                  </div>
                ) : (
                  agentRes && (
                    <AgentRes
                      agentRes={agentRes}
                      onClose={() => {
                        setAgentRes(null);
                        handleClose();
                      }}
                    />
                  )
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default ErrorModalComponent;
