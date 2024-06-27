import React, { useEffect, useReducer, useState } from 'react';
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
  Menu,
  MenuItem,
  Skeleton,
  Slide,
  Stack,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
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
import VisibilityIcon from '@mui/icons-material/Visibility'; // Import the icon for viewing
import { hi } from 'date-fns/locale';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, tapeData: action.payload, loading: false };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const TapeContentTable = ({ tapeId, tapeDate }) => {
  const navigate = useNavigate();


  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ tapeData, loading, error }, dispatch] = useReducer(reducer, {
    tapeData: [],
    loading: true,
    error: '',
  });

  const [convertDate, setConvertDate] = useState();

  useEffect(() => {
    setConvertDate(tapeDate.substring(0, 10));
  }, [tapeDate]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/tape/tapeContent/${tapeId}`);
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: result.data,
        });
        dispatch({ type: 'FETCH_SITES', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_ERROR', payload: err.message });
      }
    };
    fetchData();
  }, []);



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

  const handleDelete = async () => {
    setAnchorEl(null);
    setOpenAlert(false);
    try {
      axios.delete(`/api/tape/deleteTapeContent/${tapeId}/${tapeDate}`);
      toast.success('Tape Content deleted!', {
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

  // Handle navigation to the single tape details page
  const handleViewDetails = () => {
    navigate(`/tape/${passValue.tapeId}`, { state: { data: passValue } });
  };

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
      field: 'tapeId',
      headerName: 'Tape ID',
      flex: 0.4,
      hide: true,
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0.4,
    },
    {
      field: 'tapeContent',
      headerName: 'Tape Content',
      flex: 0,
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      flex: 0.5,
    },
  ];

  // console.log("info", userInfo);

  columns.push({
    field: 'action',
    headerName: 'Actions',
    flex: 0.5,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Box>
        <ActionButton handleClick={handleClick} params={params} open={open} />
        <Link
          to={`/tape/${params.row.tapeId}`}
          style={{ textDecoration: 'none' }}
        >
          <Button
            variant="contained"
            size="medium"
            startIcon={<VisibilityIcon />}
            sx={{
              ml: 1,
              backgroundColor: colorPalette.yellow[500],
              color: colorPalette.black[900],
              Color: colorPalette.black[300],
            }}
          ></Button>
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

  let rows = {};
  if (tapeData !== undefined) {
    rows = tapeData.map((row, x) => ({
      id: x + 1,
      tapeId: row.tapeId,
      date: row.date.substring(0, 10),
      tapeContent: row.tapeContent,
      remarks: row.remarks,
    }));
  }

  return loading ? (
    <Box width="100%">
      <LoadingAnimation />
    </Box>
  ) : error ? (
    <Alert severity="error">{error}</Alert>
  ) : (
    <Box width="100%">
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
          // handleUpdate={handleUpdate}
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

export default TapeContentTable;
