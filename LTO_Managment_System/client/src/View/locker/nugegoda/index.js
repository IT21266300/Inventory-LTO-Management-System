import { Box, IconButton } from '@mui/material'
import React, { useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { colorPalette } from 'customTheme';
import Header from 'components/Header';
import axios from 'axios';
import LockerTable from 'components/LockerComponent/LockerTableN/LockerTable';


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, lockerData: action.payload, loading: false };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function Locker() {
  const navigate = useNavigate();

  const [{ lockerData, loading, error }, dispatch] = useReducer(reducer, {
    lockerData: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/lockerN/');
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


  return (
    <Box m="1.5rem  2.5rem">
      <Helmet>
        <title>Lockers Management</title>
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
        <Header title="Lockers Management" subtitle="Manage Data Center Lockers" />
      </Box>

      {<LockerTable result={lockerData} loading={loading} error={error} />}
    </Box>
  )
}
