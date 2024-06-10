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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useContext } from 'react';
import { Store } from 'store';
import ActionButton from 'components/ActionsComponent/ActionButton';
import { LoadingAnimation } from 'components/LoadingComponent/LoadingAnimationTwo';
import DownloadActions from 'components/DownloadComponent/DownloadActions';
import ActionsMenu from 'components/ActionsComponent/ActionsMenu';
import DeleteAlertBox from 'components/ActionsComponent/DeleteAlertBox';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';

const TapeCategoryTable = ({ result, loading, error }) => {

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

  const handleUpdate = () => {
    navigate('/updateStaff', { state: { data: passValue } });
  };

  const handleDelete = async () => {
    setAnchorEl(null);
    setOpenAlert(false);
    try {
      axios.delete(`/api/staffs/delete/${passValue.staffId}`);
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

  const columns = [
    {
      field: 'id',
      headerName: 'No',
      flex: 0.1,
    },
    {
      field: 'name',
      headerName: 'System Name',
      flex: 0.7,
    },
    {
      field: 'position',
      headerName: 'View Subsystems',
      flex: 0.4,
    },
  ];

  // console.log("info", userInfo);
  // Define role-based actions
const userRoleActions = {
  Admin: {
    canViewActions: true,
  },
  Manager: {
    canViewActions: true,
  },
  User: {
    canViewActions: false,
  },
};

// Remove the duplicate declaration of 'columns'
// Initialize columns
const initialColumns = [
  // Define your initial columns here
  // Example:
  { field: 'staffId', headerName: 'Staff ID', flex: 1 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'phone', headerName: 'Phone', flex: 1 },
  { field: 'position', headerName: 'Position', flex: 1 },
];

// Add actions column based on user role
if (userRoleActions[userInfo.position]?.canViewActions) {
  initialColumns.push({
    field: 'action',
    headerName: 'Actions',
    flex: 0.5,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Box>
        <ActionButton handleClick={handleClick} params={params} open={open} />
      </Box>
    ),
  });
}

// Define pdfColumn based on user role
let pdfColumn = [];
if (userInfo.position === 'Admin') {
  pdfColumn = initialColumns.slice(1, -1); // Assuming you want to exclude the first and last column for Admin
} else {
  pdfColumn = initialColumns.slice(1); // Exclude only the first column for non-admin users
}

// Map result to rows if result is defined
let rows = [];
if (result !== undefined) {
  rows = result.map((row, x) => ({
    id: x + 1,
    staffId: row.staffId,
    name: row.name,
    phone: row.phone,
    position: row.position,
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
          navigate('/addStaff');
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
        <Typography fontSize="0.9rem">Add New System </Typography>
      </Button>
      <Box sx={{ml: '1.5rem'}}>
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
      <Box width="100%" sx={{color: '#fff'}}>
      <DataGrid
          rows={rows}
          rowHeight={60}
          columns={initialColumns}
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

export default TapeCategoryTable;

