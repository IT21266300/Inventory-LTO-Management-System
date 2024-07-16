// TapeStockTables.js
import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  Skeleton,
  Slide,
  Stack,
  Typography,
} from '@mui/material';
import { colorPalette } from 'customTheme';



import { useContext } from 'react';
import { Store } from 'store';

import { LoadingAnimation } from 'components/LoadingComponent/LoadingAnimationTwo';
import DownloadActions from 'components/DownloadComponent/DownloadActions';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddNewStock from '../TapeComponent/AddTapeStock'; 

const TapeStockTables = ({ result, loading, error }) => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [openAlert, setOpenAlert] = useState(false);
  const handleClickOpenAlert = () => {
    setOpenAlert(true);
    setAnchorEl(null);
  };

  const [openForm, setOpenForm] = useState(false);

  const handleClickOpen = () => {
    setOpenForm(true);
  };

  const handleClickClose = () => {
    setOpenForm(false);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const [buttonClickedValue, setButtonClickedValue] = useState({});

  const handleClick = (event, params) => {
    setAnchorEl(event.currentTarget);
    setButtonClickedValue(params.row);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [passValue, setPassValue] = useState({});

  useEffect(() => {
    setPassValue(buttonClickedValue);
  }, [buttonClickedValue]);

  const columns = [
    {
      field: 'id',
      headerName: 'No',
      flex: 0.1,
    },
    {
      field: 'tapeName',
      headerName: 'Tape Type',
      flex: 0.7,
    },
    {
      field: 'tapeQuantity',
      headerName: 'Tape Quantity',
      flex: 0.4,
    },
  ];

  let pdfColumn = [];

  let rows = {};
  if (result !== undefined) {
    rows = result.map((row, x) => ({
      id: x + 1,
      tapeName: row.tapeName,
      tapeQuantity: row.tapeQuantity,
    }));
  }

  return loading ? (
    <Box width="100%">
      <LoadingAnimation />
    </Box>
  ) : error ? (
    <Alert severity="error">{error}</Alert>
  ) : (
    <Box>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'flex-end',
          m: '2rem 0',
        }}
      >
        <Button
          onClick={handleClickOpen}
          sx={{
            backgroundColor: colorPalette.yellow[500],
            color: colorPalette.black[500],
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '10px 20px',
            '&:hover': {
              backgroundColor: colorPalette.black[400],
              color: colorPalette.secondary[100],
            },
          }}
        >
          <AddCircleIcon sx={{ mr: '10px' }} />
          <Typography fontSize="0.9rem">Add New Stock</Typography>
        </Button>
        <Box sx={{ ml: '1.5rem' }}>
          <DownloadActions
            pdfColumn={pdfColumn}
            rows={rows}
            funcName={'Tape Inventory Management'}
          />
        </Box>
      </Box>
      <Box
        height="100vh"
        width="100%"
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
          justifyContent: 'center',
        }}
      >
        <Box width="50%" sx={{ color: '#fff' }}>
          <DataGrid
            rows={rows}
            rowHeight={60}
            columns={columns}
            initialState={{}}
            pageSize={10}
            components={{
              toolbar: () => {
                return (
                  <GridToolbarContainer
                    style={{ justifyContent: 'flex-start', padding: '0.4rem', background: colorPalette.black[100] }}
                  >
                    <GridToolbarFilterButton style={{ color: colorPalette.yellow[500] }} />
                    <GridToolbarQuickFilter />
                  </GridToolbarContainer>
                );
              },
            }}
          />
        </Box>
      </Box>

      <Dialog open={openForm} onClose={handleClickClose}>
        <Box sx={{background: colorPalette.black[500], color: '#fff'}}>
          <DialogTitle>Add New Tape Stock</DialogTitle>
          <DialogContent>
            <AddNewStock />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClickClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default TapeStockTables;