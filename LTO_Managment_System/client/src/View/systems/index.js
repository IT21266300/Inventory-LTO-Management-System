import React, { useReducer, useEffect } from 'react';
import Header from 'components/Header';
import axios from 'axios';
import { Tabs, Tab, Box, tabsClasses, Divider } from '@mui/material';
import StaffTables from 'components/StaffComponents/StaffTables';
import CategoryTable from 'components/TapeCategoryComponent/TapeCategoryTable'
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

const Staff = () => {
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
        const result = await axios.get('/api/staffs/');
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
        <title>System Management</title>
      </Helmet>
      <Header title="System Management" subtitle="Manage Systems" />


      {tabName.col === 'staff' && <CategoryTable result={staffData} loading={loading} error={error} />}
    </Box>
  );
};

export default Staff;
