import { FC, useState, useEffect } from "react";
import { isValidFileType, getFileExtension, fileService } from "../../service/cvDocumentService";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal: FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [parsingProgress, setParsingProgress] = useState<number>(0);

  // Maximum file size in bytes (10MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      if (!isValidFileType(selectedFile.name)) {
        setFile(null);
        setError("Only PDF, DOC, and DOCX files are supported.");
        setSelectedFileName(null);
        return;
      }
      
      // Check file size
      if (selectedFile.size > MAX_FILE_SIZE) {
        setFile(null);
        setError(`File size exceeds the maximum limit of 10MB. Your file is ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB.`);
        setSelectedFileName(null);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      setSelectedFileName(selectedFile.name);
      setStatus("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setParsingProgress(0);
    const fileType = getFileExtension(file.name);
    
    try {
      // Update status based on file type
      setStatus(`Uploading ${fileType?.toUpperCase()} file...`);
      setParsingProgress(25);
      
      // Add a small delay to show the first status
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Next status update
      setStatus(`Transferring to server...`);
      setParsingProgress(50);
      
      // Upload file to server
      const response = await fileService.uploadFile(file);
      
      // Update progress
      setStatus(`Processing file...`);
      setParsingProgress(75);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus("File Successfully Uploaded!");
      setParsingProgress(100);
      
      // Store the file ID for later use
      localStorage.setItem("cvFileId", response.fileId);
      
      // Store empty CV data structure (future: get from API)
      const emptyData = {
        personalInfo: {
          name: "",
          email: "",
          phone: "",
          location: "",
          summary: "",
        },
        educations: [],
        jobs: [],
        skills: []
      };
      localStorage.setItem("cvData", JSON.stringify(emptyData));

      // Allow user to see success message before closing
      setTimeout(() => {
        onClose();
        window.dispatchEvent(new Event("cvDataUpdated"));
      }, 1500);
    } catch (error) {
      console.error("Error uploading file:", error);
      
      // More specific error messages based on error response
      if (error.response) {
        if (error.response.status === 413) {
          setError("File is too large. Maximum file size is 10MB.");
        } else if (error.response.status === 415) {
          setError("Invalid file type. Only PDF and DOCX files are supported.");
        } else if (error.response.status === 400) {
          setError(error.response.data.error || "Invalid request. Please check your file.");
        } else if (error.response.status === 500) {
          setError("The server encountered an error processing your file. Please try again later.");
        } else {
          setError(`Server error: ${error.response.data.error || "Failed to process file"}`);
        }
      } else if (error.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("Failed to process file. Please try again with a different document.");
      }
      
      setStatus("");
      setParsingProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-75 bg-gray-900">
      {/* Modal backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal content */}
      <div className="relative z-10 bg-gradient-to-br from-purple-50 to-blue-100 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-20">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
              {status && (
                <div className="text-lg font-semibold text-purple-600">
                  {status}
                </div>
              )}
              {parsingProgress > 0 && (
                <div className="w-64 bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${parsingProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        <div className="mb-4">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
            Upload CV Document
          </h2>
          <p className="text-gray-600">Supported formats: PDF, DOC, DOCX</p>
          <p className="text-gray-600 text-sm">Maximum file size: 10MB</p>
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
            {selectedFileName ? "Change file" : "Choose a file"}
          </div>
          {selectedFileName && (
            <p className="mt-2 text-gray-700">
              Selected: {selectedFileName}
              {file && (
                <span className="ml-2 text-gray-500">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              )}
            </p>
          )}
        </label>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-3">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              file && !isLoading ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Processing..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
