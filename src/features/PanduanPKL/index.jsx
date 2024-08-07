import React, { useState } from 'react';

const InfoPanduanPKL = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');

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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Info Panduan PKL</h1>

      <iframe src="https://portal.ditsmk.net/uploads/filestorage/1705550996285_c2ee304b-8216-47a3-aa09-0760a56a3ec6.pdf"  className="w-full h-96 mb-6 rounded "  frameborder="10"/>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
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
      </div>
    </div>
  );
};

export default InfoPanduanPKL;
