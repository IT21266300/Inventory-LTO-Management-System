import React, { useReducer, useEffect } from 'react';
import Header from 'components/Header';
import axios from 'axios';
import { Box, IconButton } from '@mui/material';
import StaffTables from 'components/StaffComponents/StaffTables';
import { Helmet } from 'react-helmet-async';
import { colorPalette } from 'customTheme';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
        <title>Staff Management</title>
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
        <Header title="Staff Management" subtitle="Manage Staff" />
      </Box>


      {tabName.col === 'staff' && <StaffTables result={staffData} loading={loading} error={error} />}
    </Box>
  );
};

export default Staff;
