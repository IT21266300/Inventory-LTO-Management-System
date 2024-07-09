import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import {
  Alert,
  Box,
  Button,
  Typography,
} from '@mui/material';
import { colorPalette } from 'customTheme';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Store } from 'store';
import { LoadingAnimation } from 'components/LoadingComponent/LoadingAnimationTwo';
import DownloadActions from 'components/DownloadComponent/DownloadActions';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddNewStock from '../TapeComponent/AddTapeStock'; 

const TapeStockTables = ({ result, loading, error }) => {

  const navigate = useNavigate();


  const { state} = useContext(Store);
  const { userInfo } = state;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [openAlert, setOpenAlert] = useState(false);
  const handleClickOpenAlert = () => {
    setOpenAlert(true);
    setAnchorEl(null);
  };

  const [openForm, setOpenForm] = React.useState(false);

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

  // console.log("info", userInfo);
 

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
      <LoadingAnimation/>
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
          onClick={() => {
            
            navigate(AddNewStock);//navigate to add new stock component
          }}
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
          <Typography fontSize="0.9rem">Add New Stock </Typography>
        </Button>
        <Box sx={{ml: '1.5rem'}}>
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
          
        }}
      >
        <Box width="100%" sx={{color: '#fff'}}>
        <DataGrid
            rows={rows}
            rowHeight={60}
            columns={columns}
            initialState={{
              columns: {
                
              },
              // sorting: { sortModel: [{field: 'date', sort: 'asc'}]}
            }}
            pageSize={10}
            components={{
              toolbar: () => {
                return (
                  <GridToolbarContainer
                    style={{ justifyContent: 'flex-start', padding: '0.4rem', background: colorPalette.black[100] }}
                  >
                    <GridToolbarFilterButton style={{ color: colorPalette.yellow[500]}}/>
                    <GridToolbarQuickFilter />
                  </GridToolbarContainer>
                );
              },
            }}
          />
        </Box>
        
      

      </Box>
    </Box>
  );
};

export default TapeStockTables;