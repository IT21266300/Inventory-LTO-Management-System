import React, { useEffect, useState, useContext } from 'react';
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import {
  Alert,
  Box,
  Button,
  Typography,
} from '@mui/material';
import { colorPalette } from 'customTheme';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddSubsystemPopup from '../TapeCategoryComponent/AddSubsystem'; 
import UpdateSystemPopup from '../TapeCategoryComponent/SystemUpdate';


import { Store } from 'store';
import ActionButton from 'components/ActionsComponent/ActionButton';
import { LoadingAnimation } from 'components/LoadingComponent/LoadingAnimationTwo';
import DownloadActions from 'components/DownloadComponent/DownloadActions';
import ActionsMenu from 'components/ActionsComponent/ActionsMenu';
import DeleteAlertBox from 'components/ActionsComponent/DeleteAlertBox';

const SystemTable = ({ result, loading, error }) => {
  const navigate = useNavigate();


  const { state} = useContext(Store);

  const { userInfo } = state;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [openAlert, setOpenAlert] = useState(false);
  const handleClickOpenAlert = () => {
    setOpenAlert(true);
    setAnchorEl(null);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const [buttonClickedValue, setButtonClickedValue] = useState({});
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [systemToUpdate, setSystemToUpdate] = useState(null);

  const handleUpdate = (system) => {
    setSystemToUpdate(system);
    setIsUpdatePopupOpen(true);
  };
  
  const handleCloseUpdatePopup = () => {
    setIsUpdatePopupOpen(false);
    setSystemToUpdate(null); 
  };
  
  const handleUpdateSuccess = () => {
    // Data has been updated successfully! 
    // You might want to refresh your systems list here (e.g., make an API call to get updated data)
    // ... your logic to refresh the systems list
    handleCloseUpdatePopup(); 
  };

  const handleClick = (event, params) => {
    setAnchorEl(event.currentTarget);
    setButtonClickedValue(params.row);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  

  const handleDelete = async () => {
    setAnchorEl(null);
    setOpenAlert(false);
    try {
      axios.delete(`/api/systems/delete/${passValue.sysId}`);
      toast.success('Data successfully deleted!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      window.location.reload();
    } catch (err) {
      toast.error(err.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.log(err);
    }
  };

  const [isAddSubsystemPopupOpen, setIsAddSubsystemPopupOpen] = useState(false);
  const [selectedSystemForSubsystem, setSelectedSystemForSubsystem] = useState(null);

  const handleOpenAddSubsystemPopup = (system) => {
    setSelectedSystemForSubsystem(system); 
    setIsAddSubsystemPopupOpen(true);
  };

  const handleCloseAddSubsystemPopup = () => {
    setIsAddSubsystemPopupOpen(false);
    setSelectedSystemForSubsystem(null);
  };

  const handleSubsystemAdded = () => {
    // You might want to refresh the data to show the new subsystem
    // For simplicity, we'll just log a message here
    console.log('New subsystem added!'); 
    handleCloseAddSubsystemPopup();
  };

  const [passValue, setPassValue] = useState({});

  useEffect(() => {
    setPassValue(buttonClickedValue);
  }, [buttonClickedValue]);

  const handleView = (params) => {
    navigate(`/viewSubSystem/${params.row.sysId}`);
  };


  const columns = [
    {
      field: 'id',

      headerName: 'ID',

      flex: 0.1,
    },
    {
      field: 'sysId',
      headerName: 'System ID',
      flex: 0.1,
    },
    {
      field: 'sysName',
      headerName: 'System Name',
      flex: 0.7,
    },

    {
      field: 'view',
      headerName: 'View',
      flex: 0.2,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
        onClick={() => {
          navigate('/TapeSubCategoryTable');
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
          View
        </Button>
        
      ),
    },

    {
      field: 'actions', 
      headerName: 'Add Subsystem',
      flex: 0.3,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Button
            onClick={() => handleOpenAddSubsystemPopup(params.row)}
            sx={{
              backgroundColor: colorPalette.yellow[500],
              color: colorPalette.black[500],
              fontSize: '12px', // Adjust font size as needed
              fontWeight: 'bold',
              padding: '6px 12px', // Adjust padding as needed
              '&:hover': {
                backgroundColor: colorPalette.black[400],
                color: colorPalette.secondary[100],
              },
            }}
          >
            Add Subsystem
          </Button>
          {/* Add ActionButton here if needed */}
          {/* <ActionButton handleClick={handleClick} params={params} open={open} /> */}
        </Box>
      ),
    },

  ];

  if (userInfo.position === 'Admin') {
    columns.push({
      field: 'action',
      headerName: 'Actions',
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
        <UpdateSystemPopup
systemData={systemToUpdate}
open={isUpdatePopupOpen} 
onClose={handleCloseUpdatePopup} 
onUpdateSuccess={handleUpdateSuccess} 
/>
        <ActionButton handleClick={handleClick} params={params} open={open} />
        
      </Box>
      ),
    });
  }

  let pdfColumn = [];
  if (userInfo.position === 'Admin') {
    pdfColumn = columns.slice(1, -2);
  } else {
    pdfColumn = columns.slice(1, -1);
  }

  let rows = {};
  if (result !== undefined) {
    rows = result.map((row, x) => ({

      id: x + 1,
      sysId: row.sysId,
      sysName: row.sysName,
     

    }));
  }
console.log(result)
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
          width: '50%',
          justifyContent: 'flex-end',
          m: '2rem 0',
        }}
      >
        <Button
          onClick={() => {
            navigate('/addSystem');
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
          <Typography fontSize="0.9rem">Add New System</Typography>
        </Button>
        <Box sx={{ ml: '1.5rem' }}>
          <DownloadActions
            pdfColumn={pdfColumn}
            rows={rows}
            funcName={'System Management'}
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
        <Box width="50%" sx={{ color: '#fff' }}>
          <DataGrid
            rows={rows}
            rowHeight={60}
            columns={columns}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  mongoID: false,
                },
              },
              // sorting: { sortModel: [{field: 'date', sort: 'asc'}]}
            }}
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
        <AddSubsystemPopup
      open={isAddSubsystemPopupOpen}
      onClose={handleCloseAddSubsystemPopup}
      systems={result} // Pass your systems data to the popup
      onSubsystemAdded={handleSubsystemAdded}
      parentSystemId={selectedSystemForSubsystem ? selectedSystemForSubsystem.sysId : null} // Pass the selected system ID 
    />

        <ActionsMenu
          anchorEl={anchorEl}
          open={open}
          handleClose={handleClose}
          handleUpdate={handleUpdate}
          handleClickOpenAlert={handleClickOpenAlert}
          position={userInfo.position}
        />
        

        <DeleteAlertBox
          openAlert={openAlert}
          handleCloseAlert={handleCloseAlert}
          handleDelete={handleDelete}
        />

        
      </Box>
    </Box>
  );
};

export default SystemTable;



















