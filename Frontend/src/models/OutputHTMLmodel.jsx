import React from 'react'

const OutputModal = () => (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
    <div className="relative w-full h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-4 bg-gray-200 dark:bg-gray-700">
        <h2 className="font-bold text-black dark:text-white">Output Preview</h2>
        <button
          onClick={toggleOutputModal}
          className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <X className="text-black dark:text-white" size={20} />
        </button>
      </div>
      <div id="outputModalContent" className="h-full pt-14 overflow-auto"></div>
    </div>
  </div>
);

export default OutputHTMLmodel