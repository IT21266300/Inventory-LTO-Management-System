import React, { useState } from 'react';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import Typography from '@mui/material/Typography';
import { colorPalette } from 'customTheme'; // Ensure this import path is correct
import { toast } from 'react-toastify'; // Import toast

const ImportExcel = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    importExcel(event.target.files[0]);
  };
  
  const importExcel = async (file) => {
    if (!file) {
      toast.error("Please select a file first.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('/api/tape/import_excel', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to import file", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        return; 
      }
  
      toast.success("File imported successfully!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (err) {
      console.error('Error:', err);
      toast.error("An error occurred during import", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };
  return (
    <>
      <input
        type="file"
        id="excelFile"
        name="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button
        aria-controls={undefined}
        aria-haspopup="false"
        aria-expanded={undefined}
        onClick={() => document.getElementById('excelFile').click()}
        sx={{
          backgroundColor: colorPalette.yellow[500],
          color: colorPalette.black[500],
          fontSize: '14px',
          fontWeight: 'bold',
          padding: '10px 20px',
          mr: '2rem',
          '&:hover': {
            backgroundColor: colorPalette.black[400],
            color: colorPalette.secondary[100],
          },
        }}
      >
        <DownloadIcon sx={{ mr: '10px'}} />
        <Typography fontSize="1rem">Import</Typography>
      </Button>
    </>
  );
};

export default ImportExcel;
