import React from 'react';

interface ImportJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportJobsModal: React.FC<ImportJobsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Import Jobs</h2>
        <p className="text-gray-700 mb-4">Import job via url or job description</p>

        <div className="mb-4">
          <label htmlFor="jobUrl" className="block text-gray-700 text-sm font-bold mb-2">
            From URL <span className="ml-1 cursor-pointer">ⓘ</span>
          </label>
          <input
            type="text"
            id="jobUrl"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter URL"
          />
          <button className="text-blue-500 hover:text-blue-700 mt-2 text-sm">Add More</button>
        </div>

        <div className="mb-6">
          <label htmlFor="jobDescription" className="block text-gray-700 text-sm font-bold mb-2">
            From Job Description
          </label>
          <textarea
            id="jobDescription"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            placeholder="Enter job description"
          />
        </div>

        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            type="button"
          >
            Import
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportJobsModal;
