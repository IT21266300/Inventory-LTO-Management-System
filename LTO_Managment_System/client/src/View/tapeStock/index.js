import React, { useReducer, useEffect } from 'react';
import Header from 'components/Header';
import axios from 'axios';
import {
  Tabs,
  Tab,
  Box,
  tabsClasses,
  Divider,
  IconButton,
} from '@mui/material';
import TapeTables from 'components/TapeComponent/TapeStockTable';
import { Helmet } from 'react-helmet-async';
import { colorPalette } from 'customTheme';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, tapeStock: action.payload, loading: false };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const TapeStock = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const [{ tapeStock, loading, error }, dispatch] = useReducer(reducer, {
    tapeStock: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/inventory/tapeStock');
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

  console.log('tapeStock', tapeStock);
  return (
    <Box m="1.5rem  2.5rem">
      <Helmet>
        <title>Tape Stock Management</title>
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
        <Header title="Tape Inventory Management" subtitle="Manage Tapes Inventory" />
      </Box>

      <TapeTables result={tapeStock} loading={loading} error={error} />
    </Box>
  );
};

export default TapeStock;
