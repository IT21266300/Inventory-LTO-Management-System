import React, { useState } from 'react';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return; 

    const formData = new FormData();
    formData.append('csvFile', selectedFile);

    try {
      const response = await fetch('/api/tapes/upload', { 
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      console.log('File uploaded successfully:', data); 
      // Handle success (e.g., display a success message, clear the input)
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle errors appropriately (e.g., display an error message)
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleSubmit} disabled={!selectedFile}>
        Upload CSV
      </button>
    </div>
  );
};

export default FileUpload;