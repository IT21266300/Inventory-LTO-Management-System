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
  IconButton,
  Typography,
  Modal,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { colorPalette } from 'customTheme';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { Store } from 'store';
import ActionButton from 'components/ActionsComponent/ActionButton';
import { LoadingAnimation } from 'components/LoadingComponent/LoadingAnimationTwo';
import DownloadActions from 'components/DownloadComponent/DownloadActions';
import ActionsMenu from 'components/ActionsComponent/ActionsMenu';
import DeleteAlertBox from 'components/ActionsComponent/DeleteAlertBox';
import VisibilityIcon from '@mui/icons-material/Visibility'; 
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

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', // Increased width to 80%
  maxWidth: 1000, // Optional: Set a maximum width
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const contentStyle = {
  maxHeight: 400, // Set a maximum height for the content area
  overflowY: 'auto', // Enable vertical scrolling
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

   // State for managing the modal
   const [openDetailsModal, setOpenDetailsModal] = useState(false);
   const [selectedTapeContent, setSelectedTapeContent] = useState(null);
 
   const handleOpenDetailsModal = () => {
     setOpenDetailsModal(true);
   };
 
   const handleCloseDetailsModal = () => {
     setOpenDetailsModal(false);
   };
 
   // Handle viewing details
   const handleViewDetail = (row) => {
     setSelectedTapeContent(row);
     handleOpenDetailsModal();
   };

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
      axios.delete(`/api/tape/deleteTapeContent/${buttonClickedValue.tapeId}/${buttonClickedValue.date}`);
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
    flex: userInfo.position === 'Admin' ? 0.5 : 0.3,
    sortable: false,
    filterable: false,
    textAlign: 'center',
    renderCell: (params) => (
      <Box>
        {userInfo.position === 'Admin' && (
          <ActionButton handleClick={handleClick} params={params} open={open}/>
        )}
        <Link
          to={`/tape/${params.row.tapeId}`}
          style={{ textDecoration: 'none' }}
        >
          <IconButton
          aria-label="view"
          onClick={() => handleViewDetail(params.row)} // Pass the entire row data
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

  let rows = {};
  if (tapeData !== undefined) {
    rows = tapeData.map((row, x) => ({
      id: x + 1,
      tapeId: row.tapeId,
      date: row.date,
      tapeContent: row.tapeContent,
      remarks: row.remarks,
    }));
  }

  return loading ? (
    
    <Box width="100%">
      <LoadingAnimation />
    </Box>
  ) : error ? (
    <Alert severity="warning">Tape Content Empty..!</Alert>
  ) : (
    <><Box width="100%">
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
                      tapeId: false,
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
                          style={{ color: colorPalette.yellow[500] }} />
                        <GridToolbarQuickFilter />
                      </GridToolbarContainer>
                    );
                  },
                }} />
            </Box>

            <ActionsMenu
              anchorEl={anchorEl}
              open={open}
              handleClose={handleClose}
              // handleUpdate={handleUpdate}
              handleClickOpenAlert={handleClickOpenAlert}
              position={userInfo.position} />

            <DeleteAlertBox
              openAlert={openAlert}
              handleCloseAlert={handleCloseAlert}
              handleDelete={handleDelete} />
          </Box>
        </Box><Modal
      open={openDetailsModal}
      onClose={handleCloseDetailsModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Tape Content Details
        </Typography>
        {selectedTapeContent && (
          <Box sx={contentStyle}> {/* Apply contentStyle here */}
            <Typography variant="body1">
              <strong>Date:</strong> {selectedTapeContent.date}
            </Typography>
            <Typography variant="body1">
              <strong>Tape Content:</strong> {selectedTapeContent.tapeContent}
            </Typography>
            <Typography variant="body1">
              <strong>Remarks:</strong> {selectedTapeContent.remarks}
            </Typography>
          </Box>
        )}
      </Box>
    </Modal></>

    
    
  );
};

export default TapeContentTable;
