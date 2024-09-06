import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API requests
import Cookies from 'js-cookie';
import Api from '../../api';
import hasAnyPermission from '../../utils/Permissions';



const InfoPanduanPKL = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const token = Cookies.get("token"); // Get token from cookies


  const fetchPdf = async () => {
    try {
      // First, fetch the first page to get the total number of pages
      const firstPageResponse = await Api.get('/admin/panduan', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const totalPages = firstPageResponse.data.data.last_page;
  
      // Now fetch the last page
      const response = await Api.get(`/admin/panduan?page=${totalPages}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Assuming each page contains only one document
      const latestDocument = response.data.data.data[0];
      setPdfUrl(latestDocument.dokumen);
  
      console.log("Latest PDF URL:", latestDocument.dokumen);
  
    } catch (error) {
      console.error("Error fetching PDF:", error.message);
    }
  };
  
useEffect(() => {
  fetchPdf();
})
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : '');
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('dokumen', selectedFile);
      formData.append('user_id', 1);

      try {
        const response = await Api.post('/admin/panduan', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log("File uploaded successfully:", response.data);
        setFileName(''); // Clear the file name after successful upload
        setSelectedFile(null); // Clear the selected file
        toggleFormVisibility(); // Hide the form
        fetchPdf(); // Refetch the PDF to get the updated file
      } catch (error) {
        console.error("Error uploading file:", error.response);
        // Handle error (e.g., show notification)
      }
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
      <div className="flex-grow relative p-4">
      {pdfUrl ? (
        <iframe
          src={`${pdfUrl}`}
          title="Panduan PKL"
          className="w-full h-full"
          style={{ border: 'none', height: '90vh' }}
          onContextMenu={(e) => e.preventDefault()} // Disable right-click
        />
      ) : (
        <p className="text-center text-gray-500">Loading PDF...</p>
      )}
    </div>


      {/* Floating Upload Button */}
      {hasAnyPermission(["siswa.delete"]) && (
        
     
      <button
        onClick={toggleFormVisibility}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
      >
        Upload File
      </button>
       )}

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
              className="bg-blue-500 w-[100px] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 mr-4 ml-[300px] text-lg"
            >
              Upload
            </button>
            <button
              onClick={toggleFormVisibility}
              className="mt-2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-600 transition duration-300 w-[100px] text-lg"
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
