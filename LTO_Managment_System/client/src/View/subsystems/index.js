import React, { useReducer, useEffect } from 'react';
import Header from 'components/Header';
import axios from 'axios';
import { Box } from '@mui/material';
import CategoryTable from 'components/TapeCategoryComponent/TapeCategoryTable'
import { Helmet } from 'react-helmet-async';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, staffData: action.payload, loading: false };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const SubSystem = () => {
 
  const [value, setValue] = React.useState(0);
  const [site, setSite] = React.useState(null);
  const [tabName, setTabName] = React.useState({
    label: 'Sub System',
    col: 'subsystem',
  });

  const [{ systemData, loading, error }, dispatch] = useReducer(reducer, {
    systemData: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/subsystems/');
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
  }, [tabName, site]);

  console.log('SubSystemData', systemData);
  return (
    <Box m="1.5rem  2.5rem">
      <Helmet>
        <title>System Management</title>
      </Helmet>
      <Header title="Sub System Management" subtitle="Manage Sub Systems" />


      <CategoryTable result={systemData} loading={loading} error={error} />
    </Box>
  );
};

export default SubSystem;
