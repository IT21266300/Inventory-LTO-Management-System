import React, { useState } from 'react';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import Typography from '@mui/material/Typography';
import { colorPalette } from 'customTheme'; // Ensure this import path is correct

const ImportExcel = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    importExcel(event.target.files[0]);
  };

  const importExcel = (file) => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/tape/import_excel', {
      method: 'POST',
      body: formData
    }).then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('File imported successfully');
      } else {
        alert('Failed to import file');
      }
    }).catch(error => {
      console.error('Error:', error);
    });
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
