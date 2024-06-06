import React, { useReducer, useEffect } from 'react';
import Header from 'components/Header';
import axios from 'axios';
import { Tabs, Tab, Box, tabsClasses, Divider } from '@mui/material';
import TapeTable from 'components/TapeComponent/TapeTable';
import { Helmet } from 'react-helmet-async';
import { colorPalette } from 'customTheme';
import AddCircleIcon from '@mui/icons-material/AddCircle';

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

const Tape = () => {
  const tabs = [
    {
      id: '1',
      label: 'Staff',
      col: 'staff',
    },
    // {
    //   id: '2',
    //   label: '',
    //   col: 'teams',
    // },
  ];
  const [value, setValue] = React.useState(0);
  const [site, setSite] = React.useState(null);
  const [tabName, setTabName] = React.useState({
    label: 'Staff',
    col: 'staff',
  });

  const [{ staffData, loading, error }, dispatch] = useReducer(reducer, {
    staffData: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/staff/');
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

  console.log('StaffData', staffData);
  return (
    <Box m="1.5rem  2.5rem">
      <Helmet>
        <title>Tape Management</title>
      </Helmet>
      <Header title="Tape Management" subtitle="Manage Tape" />


      {tabName.col === 'staff' && <TapeTable result={staffData} loading={loading} error={error} />}
    </Box>
  );
};

export default Tape;
