import React, { useEffect, useState } from 'react';
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Slide,
  Stack,
  Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { colorPalette } from 'customTheme';
import axios from 'axios';
import { toast } from 'react-toastify';

import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useContext } from 'react';
import { Store } from 'store';
import Search from 'components/SearchComponent/SearchAction';
import ActionButton from 'components/ActionsComponent/ActionButton';
import { LoadingAnimation } from 'components/LoadingComponent/LoadingAnimationTwo';
import DownloadActions from 'components/DownloadComponent/DownloadActions';
import ActionsMenu from 'components/ActionsComponent/ActionsMenu';
import DeleteAlertBox from 'components/ActionsComponent/DeleteAlertBox';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Import the icon for viewing
import SelectTapeStock from './SelectTape';

const TapeTable = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
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
    navigate('/updateTape', { state: { data: passValue } });
  };

  const handleDelete = async () => {
    setAnchorEl(null);
    setOpenAlert(false);
    try {
      axios.delete(`/api/tape/delete/${passValue.tapeId}`);
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

  const handleViewDetails = () => {
    navigate(`/tape/${passValue.tapeId}`, { state: { data: passValue } });
  };

  const [tapes, setTapes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTapes = async () => {
      try {
        const response = await axios.get('/api/tape'); // Replace with your actual API endpoint
        setTapes(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTapes();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/tape/search?query=${searchQuery}`); // Replace with your actual API endpoint for search
      setTapes(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: 'No',
      flex: 0.1,
    },
    {
      field: 'tapeId',
      headerName: 'Tape ID',
      flex: 0.4,
    },
    {
      field: 'sysName',
      headerName: 'System Name',
      flex: 0.4,
    },
    {
      field: 'sysId',
      headerName: 'System No',
      flex: 0,
    },
    {
      field: 'subSysName',
      headerName: 'Application Name',
      flex: 0.5,
    },
    {
      field: 'bStatus',
      headerName: 'Backup Status',
      flex: 0.5,
      renderCell: (params) => {
        const status = params.value;
        return (
          <Box
            sx={{
              backgroundColor:
                status === 'Completed'
                  ? '#017816'
                  : status === 'In Progress'
                  ? '#0366fc'
                  : status === 'Not Taken'
                  ? '#580096'
                  : '#fc0303',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              textAlign: 'center',
              width: '100%',
            }}
          >
            {status}
          </Box>
        );
      },
    },
    {
      field: 'mType',
      headerName: 'Media Type',
      flex: 0.4,
    },
    {
      field: 'tStatus',
      headerName: 'Tape Status',
      flex: 0.5,
      renderCell: (params) => {
        const status = params.value;
        return (
          <Box
            sx={{
              backgroundColor: status === 'Completed' ? '#017816' : '#0366fc',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              textAlign: 'center',
              width: '100%',
            }}
          >
            {status}
          </Box>
        );
      },
    },
    {
      field: 'sDate',
      headerName: 'Start Date',
      flex: 0.4,
    },
    {
      field: 'eDate',
      headerName: 'End Date',
      flex: 0.4,
    },
    {
      field: 'lStatus',
      headerName: 'Location Status',
      flex: 0.4,
    },
  ];

  columns.push({
    field: 'action',
    headerName: 'Actions',
    flex: userInfo.position === 'Admin' ? 0.5 : 0.3,
    sortable: false,
    filterable: false,
    textAlign: 'center',
    renderCell: (params) => (
      <Box>
        {userInfo.position === 'Admin' && (
          <ActionButton
            handleClick={handleClick}
            params={params}
            open={open}
          />
        )}
        <Link
          to={`/tape/${params.row.tapeId}`}
          style={{ textDecoration: 'none' }}
        >
          <IconButton
            sx={{
              backgroundColor: colorPalette.yellow[500],
              color: colorPalette.black[500],
              '&:hover': {
                backgroundColor: colorPalette.yellow[400],
                color: colorPalette.black[500],
              },
            }}
          >
            <VisibilityIcon />
          </IconButton>
        </Link>
      </Box>
    ),
  });

  let pdfColumn = [];
  if (userInfo.position === 'Admin') {
    pdfColumn = columns.slice(1, -1);
  } else {
    pdfColumn = columns.slice(1);
  }

  let rows = tapes.map((row, x) => ({
    id: x + 1,
    tapeId: row.tapeId,
    sysName: row.sysName,
    sysId: row.sysId,
    subSysName: row.subSysName,
    bStatus: row.bStatus,
    mType: row.mType,
    tStatus: row.tStatus,
    sDate: row.sDate,
    eDate: row.eDate,
    lStatus: row.lStatus,
  }));

  //=======================================================================
  const [openForm, setOpenForm] = React.useState(false);

  const handleClickOpen = () => {
    setOpenForm(true);
  };

  const handleClickClose = () => {
    setOpenForm(false);
  };

  // =========================================================================
  return loading ? (
    <Box width="100%">
      <LoadingAnimation />
    </Box>
  ) : error ? (
    <Alert severity="error">{error}</Alert>
  ) : (
    <Box>

      <Box sx={{ marginBottom: '1rem' }}>        
        <Box sx={{ marginBottom: '1rem' }}>
        <Search/>
      </Box>
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
          <Typography fontSize="0.9rem">Add New Tape</Typography>
        </Button>
        <Box sx={{ ml: '1.5rem' }}>
          <DownloadActions
            pdfColumn={pdfColumn}
            rows={rows}
            funcName={'Tape Management'}
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
          <DataGrid
            rows={rows}
            rowHeight={60}
            columns={columns}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  sysId: false,
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
          handleCloseAlert={handleCloseAlert} // Pass the function as a prop 
          handleDelete={handleDelete}
        />
        
        <SelectTapeStock open={openForm} handleClickClose={handleClickClose}/>
      </Box>
    </Box>
    </Box>
  );
};

export default TapeTable;