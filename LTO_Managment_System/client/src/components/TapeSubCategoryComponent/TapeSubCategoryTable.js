import React, { useEffect, useState, useContext } from 'react';
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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { Store } from 'store';
import ActionButton from 'components/ActionsComponent/ActionButton';
import { LoadingAnimation } from 'components/LoadingComponent/LoadingAnimationTwo';
import DownloadActions from 'components/DownloadComponent/DownloadActions';
import ActionsMenu from 'components/ActionsComponent/ActionsMenu';
import DeleteAlertBox from 'components/ActionsComponent/DeleteAlertBox';
import UpdateSystemPopup from './UpdateSubCategory';

const TapeSubCategoryTable = ({ result, loading, error, subsystemsdata }) => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  console.log(subsystemsdata)

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
  const [systemToUpdate, setSystemToUpdate] = useState(null);
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);


  const handleClick = (event, params) => {
    setAnchorEl(event.currentTarget);
    setButtonClickedValue(params.row);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = (system) => {
    setSystemToUpdate(system);
    setIsUpdatePopupOpen(true);
  };

  const handleCloseUpdatePopup = () => {
    setIsUpdatePopupOpen(false);
    setSystemToUpdate(null);
  };

  const handleUpdateSuccess = () => {
    handleCloseUpdatePopup();
  };

  const handleDelete = async () => {
    setAnchorEl(null);
    setOpenAlert(false);
    try {
      axios.delete(`/api/subsystems/delete/${passValue.sysId}`);
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

  const [passValue, setPassValue] = useState({});

  useEffect(() => {
    setPassValue(buttonClickedValue);
  }, [buttonClickedValue]);

//   const handleView = (params) => {
//     navigate(`/viewSubSystem/${params.row.sysId}`);
//   };

  const columns = [
    {
      field: 'subsysId',
      headerName: 'Sub System ID',
      flex: 0.1,
    },
    {
      field: 'subsysName',
      headerName: 'Sub System Name',
      flex: 0.7,
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
  if (subsystemsdata !== undefined) {
    rows = subsystemsdata.map((row, x) => ({
      id : x + 1,
      subsysId : row.subSysId,
      subsysName: row.subSysName,
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
          marginBottom: '1rem'
        }}
      >
        {/* <Button
          onClick={() => {
            navigate('/addSubSystem');
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
          <Typography fontSize="0.9rem">Add New Sub System</Typography>
        </Button> */}
        <Box sx={{ ml: '1.5rem' }}>
          <DownloadActions
            pdfColumn={pdfColumn}
            rows={rows}
            funcName={'Sub-System Management'}
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
        <Box width="100%" sx={{ color: '#fff' }}>
          <DataGrid sx={{backgroundColor:  colorPalette.black[500]}}
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

export default TapeSubCategoryTable;
