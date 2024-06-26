import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Box, Alert, Button, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import DownloadIcon from '@mui/icons-material/Download';
import { colorPalette } from 'customTheme';

const LogTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await axios.get('/logs');
        setLogs(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const handleDownload = (date) => {
    axios.get(`/download-log/${date}`, { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `staff_activity_${date}.log`);
        document.body.appendChild(link);
        link.click();
      })
      .catch(err => {
        toast.error('Error downloading log file', {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };

  const columns = [
    { field: 'id', headerName: 'No', flex: 0.1 },
    { field: 'date', headerName: 'Date', flex: 0.7 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={() => handleDownload(params.row.date)}
        >
          Download
        </Button>
      ),
    },
  ];

  const rows = logs.map((log, index) => ({
    id: index + 1,
    date: log.date,
  }));

  return loading ? (
    <Box width="100%">
      <Typography>Loading...</Typography>
    </Box>
  ) : error ? (
    <Alert severity="error">{error}</Alert>
  ) : (
    <Box height="100vh"
    width="100%"
    sx={{
      '& .MuiDataGrid-cell': {
        borderBottom: 'none',
        color: '#fff',
      },
      '& .MuiDataGrid-columnHeaders': {
        backgroundColor: colorPalette.black1[400],
        color: colorPalette.secondary[200],
        // borderBottom: 'none',
      },

      '& .MuiDataGrid-footerContainer': {
        backgroundColor: colorPalette.black1[500],
        color: colorPalette.yellow[500],
        // color: 'green',
        borderTop: 'none',
      },
      '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
        color: `${colorPalette.primary[500]} !important`,
      },
      display: 'flex',
    }}>
    <Box height="80vh" width="100%" sx={{color: '#fff'}}>

      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        components={{
          toolbar: () => {
            return (
              <GridToolbarContainer
                style={{
                  justifyContent: 'flex-start',
                  padding: '0.4rem',
                  background: colorPalette.black[100],
                }}
              >
                <GridToolbarFilterButton
                  style={{ color: colorPalette.yellow[500] }}
                />
                <GridToolbarQuickFilter />
              </GridToolbarContainer>
            );
          },
        }}
      />
    </Box>
    </Box>
  );
};

export default LogTable;
