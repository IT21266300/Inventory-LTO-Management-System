import React, { useReducer, useEffect } from 'react';
import Header from 'components/Header';
import axios from 'axios';
import {Box,IconButton } from '@mui/material';
import LogTables from 'components/LogComponent/LogTable';
import { Helmet } from 'react-helmet-async';
import { colorPalette } from 'customTheme';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, logData: action.payload, loading: false };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Logs = () => {

  const navigate = useNavigate();

  
  const [value, setValue] = React.useState(0);
  
 

  const [{ logData, loading, error }, dispatch] = useReducer(reducer, {
    logData: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/logs');
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
  }, [ ]);

  console.log('logData', logData);
  return (
    <Box m="1.5rem  2.5rem">
      <Helmet>
        <title>Log Management</title>
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
        <Header title="Log Management" subtitle="Manage Logs" />
      </Box>
      <LogTables/>
    </Box>
  );
};

export default Logs;