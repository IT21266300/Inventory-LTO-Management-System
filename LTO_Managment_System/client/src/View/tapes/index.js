import React, { useReducer, useEffect } from 'react';
import Header from 'components/Header';
import axios from 'axios';
import {
  Box,
  IconButton,
Typography,
Button,
} from '@mui/material';
import TapeTables from 'components/TapeComponent/TapeTable';
import { Helmet } from 'react-helmet-async';
import { colorPalette } from 'customTheme';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate } from 'react-router-dom';
import SelectTapeStock from '../../components/TapeComponent/SelectTape';

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

const Tapes = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const [{ tapeData, loading, error }, dispatch] = useReducer(reducer, {
    tapeData: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/tape/');
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

  const [openForm, setOpenForm] = React.useState(false);

  const handleClickOpen = () => {
    setOpenForm(true);
  };

  const handleClickClose = () => {
    setOpenForm(false);
  };

  return (
    <Box m="1.5rem  2.5rem">
      <Helmet>
        <title>Tape Management</title>
      </Helmet>
      <Box sx={{ width: '100%', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: colorPalette.yellow[500],
            color: colorPalette.black[500],
            width: '40px',
            height: '40px',
            '&:hover': {
              backgroundColor: colorPalette.yellow[400],
              color: colorPalette.black[500],
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Header title="Tape Management" subtitle="Manage Tapes" />
      </Box>
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

        <SelectTapeStock open={openForm} handleClickClose={handleClickClose}/>

      <TapeTables result={tapeData} loading={loading} error={error} />
    </Box>
  );
};

export default Tapes;
