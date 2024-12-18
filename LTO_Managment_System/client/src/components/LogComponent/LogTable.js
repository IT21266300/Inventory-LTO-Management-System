import React, { useEffect, useState, useContext } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import {
  Alert,
  Box,
  Button,
} from '@mui/material';
import { colorPalette } from 'customTheme';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DownloadIcon from '@mui/icons-material/Download';
import { Store } from 'store';
import { LoadingAnimation } from 'components/LoadingComponent/LoadingAnimationTwo';

const LogTable = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  // State to manage Log Files
  const [logFiles, setLogFiles] = useState([]);
  // State to manage recent files (for DataGrid)
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch log files from server
  useEffect(() => {
    const fetchLogFiles = async () => {
      try {
        const response = await axios.get('/api/logs'); // Replace with your server endpoint
        setLogFiles(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLogFiles();
  }, []);

  // Fetch recent files for the DataGrid (only run once)
  useEffect(() => {
    const fetchRecentFiles = async () => {
      try {
        const response = await fetch('/api/logs/recent-files');
        const data = await response.json();
        setRows(data);
      } catch (err) {
        // Handle errors from fetching recent files
        console.error("Error fetching recent files:", err);
      }
    };
    fetchRecentFiles();
  }, []); // Empty dependency array ensures this runs only once

  const handleDownload = (fileName) => {
    axios.get(`/api/logs/download/${fileName}`, { responseType: 'blob' }) // Replace with your server endpoint
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(err => {
        toast.error('Error downloading log file', {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'fileName',
      headerName: 'File Name',
      flex: 1,
    },
    // {
    //   field: 'createdAt',
    //   headerName: 'Created At',
    //   flex: 1,
    // },
  ];

  if (userInfo.position === 'Admin') {
    columns.push({
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload(params.row.fileName)}
          >
            Download
          </Button>
        </div>
      ),
    });
  }

  return loading ? (
    <Box width="100%">
      <LoadingAnimation />
    </Box>
  ) : error ? (
    <Alert severity="error">{error}</Alert>
  ) : (
    <Box sx={{marginTop: '1.4rem'}}>
      <Box
        height="100vh"
        width="75%"
        sx={{
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
            color: '#fff',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colorPalette.black1[400],
            color: colorPalette.secondary[200],
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: colorPalette.black1[500],
            color: colorPalette.yellow[500],
            borderTop: 'none',
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${colorPalette.primary[500]} !important`,
          },
          display: 'flex',
        }}
      >
        <Box width="100%" sx={{ color: '#fff' }}>
          <DataGrid
            rows={rows} // Use the 'rows' state for the DataGrid
            rowHeight={60}
            columns={columns}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  mongoID: false,
                },
              },
            }}
            pageSize={10}
            components={{
              toolbar: () => (
                <GridToolbarContainer
                  style={{ justifyContent: 'flex-start', padding: '0.4rem', background: colorPalette.black[100] }}
                >
                  <GridToolbarFilterButton style={{ color: colorPalette.yellow[500] }} />
                  <GridToolbarQuickFilter />
                </GridToolbarContainer>
              ),
            }}
          />
        </Box>
      </Box>
      
    </Box>
  );
};

export default LogTable;