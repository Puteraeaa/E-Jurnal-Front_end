import React, { useState } from 'react';
import pdf from '../../assets/pdf.pdf'; // Ensure the path is correct

const InfoPanduanPKL = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : '');
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log("File selected:", selectedFile);
    } else {
      console.log("No file selected");
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div className="relative h-screen flex flex-col bg-gray-100">
    
      {/* Responsive PDF iframe container */}
      <div className="flex-grow overflow-hidden relative p-4">
        <iframe
          src={pdf}
          title="Panduan PKL"
          className="w-full h-full"
          style={{ border: 'none' }}
        />
      </div>

      {/* Floating Upload Button */}
      <button
        onClick={toggleFormVisibility}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
      >
        Upload File
      </button>

      {/* Conditional Upload Form */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Upload File Panduan:</h2>
            <div className="mb-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
            </div>
            {fileName && (
              <div className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                <p className="text-lg font-medium">File Selected:</p>
                <p>{fileName}</p>
              </div>
            )}
            <button
              onClick={handleUpload}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 w-full text-lg"
            >
              Upload
            </button>
            <button
              onClick={toggleFormVisibility}
              className="mt-2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-600 transition duration-300 w-full text-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoPanduanPKL;
