import { FC, useState, useEffect } from "react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal: FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'pdf' || fileExtension === 'doc' || fileExtension === 'docx') {
        setFile(selectedFile);
        setError(null);
        setSelectedFileName(selectedFile.name); // Set the selected file name
      } else {
        setFile(null);
        setError("Only PDF, DOC, and DOCX files are supported.");
        setSelectedFileName(null); // Reset the selected file name
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      // Here you would add the actual file upload logic to your server
      console.log("Uploading file:", file.name);
      // Example: const formData = new FormData(); formData.append('file', file);
      // await fetch('/api/upload', { method: 'POST', body: formData });
      
      onClose();
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-75 bg-gray-900">
      {/* Modal backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative z-10 bg-gradient-to-br from-purple-50 to-blue-100 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Upload CV Document</h2>
          <p className="text-gray-600">Supported formats: PDF, DOC, DOCX</p>
        </div>
        
        <label className="block mb-4">
          <span className="sr-only">Choose file</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="sr-only"
          />
          <div className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-center cursor-pointer">
            {selectedFileName ? 'Change file' : 'Choose a file'}
          </div>
          {selectedFileName && <p className="mt-2 text-gray-700">Selected: {selectedFileName}</p>}
        </label>
          
          {error && <p className="text-red-500 mb-3">{error}</p>}
          
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file}
              className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                file ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              Upload
            </button>
          </div>
      </div>
    </div>
  );
};

export default UploadModal;
