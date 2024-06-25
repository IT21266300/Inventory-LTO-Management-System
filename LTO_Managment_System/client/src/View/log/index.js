import React, { useReducer, useEffect } from 'react';
import Header from 'components/Header';
import axios from 'axios';
import { Tabs, Tab, Box, tabsClasses, Divider } from '@mui/material';
//import LogTables from 'components/LogComponent/LogTable';
import { Helmet } from 'react-helmet-async';
import { colorPalette } from 'customTheme';
import AddCircleIcon from '@mui/icons-material/AddCircle';

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
        const result = await axios.get('/api/log/');
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
      <Header title="Log Management" subtitle="Manage Logs" />


      {/* <LogTables result={logData} loading={loading} error={error} /> */}
    </Box>
  );
};

export default Logs;