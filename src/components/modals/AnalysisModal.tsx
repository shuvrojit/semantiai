import React, { useEffect, useRef } from 'react';

interface AnalysisModalProps {
  analysis: any; // Using any for dynamic data structure
  onClose: () => void;
}

const RecursiveDisplay: React.FC<{ data: any; depth?: number }> = ({ data, depth = 0 }) => {
  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return <span className="text-gray-800">{String(data)}</span>;
  }

  if (Array.isArray(data)) {
    return (
      <ul className="list-disc pl-4 space-y-1">
        {data.map((item, index) => (
          <li key={index}>
            <RecursiveDisplay data={item} depth={depth + 1} />
          </li>
        ))}
      </ul>
    );
  }

  if (typeof data === 'object' && data !== null) {
    return (
      <div className={`${depth > 0 ? 'ml-4' : ''} space-y-2`}>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <h4 className="text-md font-semibold capitalize">
              {key.replace(/_/g, ' ')}:
            </h4>
            <div className="pl-4">
              <RecursiveDisplay data={value} depth={depth + 1} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const AnalysisModal: React.FC<AnalysisModalProps> = ({ analysis, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Content Analysis</h2>
        <div className="space-y-4">
          <RecursiveDisplay data={analysis} />
        </div>
        <div className="mt-6 pt-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
