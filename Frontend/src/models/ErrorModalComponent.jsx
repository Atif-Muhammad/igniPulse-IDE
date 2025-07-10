import React, { useState, useEffect, useRef } from "react";
import { HelpCircle } from "lucide-react";
import LinearLoader from "../components/Loaders/LinearLoader";
import AgentRes from "../components/AgentRes";

function ErrorModalComponent({
  isError,
  isPending,
  agentRes,
  handleAgentCall,
  setAgentRes,
  onclose,
}) {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const modalRef = useRef();

  const handleIconClick = () => {
    setShowErrorModal(true);
    handleAgentCall();
  };

  const handleClose = () => {
    setShowErrorModal(false);
    onclose?.();
  };

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
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
          {/* Fixed Help Icon in Bottom-Right */}
          <div className="absolute bottom-10 right-0 z-50">
            <div
              onClick={handleIconClick}
              className="bg-black w-10 h-10 text-white text-2xl flex items-center justify-center rounded-full cursor-pointer"
            >
              <HelpCircle size={24} />
            </div>
          </div>

          {/* Modal opens at bottom-left or anywhere else */}
          {showErrorModal && (
            <div
              ref={modalRef}
              className="absolute bottom-10 right-12 z-50 bg-gray-200 border-2 border-blue-600 md:w-88  px-2 py-3 h-40 flex items-center justify-center rounded-md shadow-lg"
            >
              {isPending ? (
                <LinearLoader />
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
          )}
        </>
      )}
    </>
  );
}

export default ErrorModalComponent;
