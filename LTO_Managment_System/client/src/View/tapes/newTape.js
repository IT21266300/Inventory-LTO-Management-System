import React, { useEffect } from 'react';
import Header from 'components/Header';
import Box from '@mui/material/Box';
import {
  Button,
  IconButton,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { colorPalette } from 'customTheme';
import HttpsIcon from '@mui/icons-material/Https';
import FlexBetween from 'components/FlexBetween';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useReducer } from 'react';

const positions = ['Admin', 'Operator', 'Read Only'];

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, systemData: action.payload, loading: false };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Tape = () => {
  const navigate = useNavigate();
  const [tapeId, setTapeId] = useState(''); // Add state for tape ID
  const [{ systemData, loading, error }, dispatch] = useReducer(reducer, {
    systemData: [],
    loading: true,
    error: '',
  });
  const [subSystems, setSubSystems] = useState([]);
  const [parentSystem, setParentSystem] = useState({
    sysName: '',
    sysId: '',
  });
  const [subSysName, setSubSysName] = useState(''); // Add state for subsystem name
  const [bStatus, setBStatus] = useState(''); // Add state for backup status
  const [mType, setMType] = useState(''); // Add state for media type
  const [tStatus, setTStatus] = useState(''); // Add state for tape status
  const [sDate, setSDate] = useState(''); // Add state for start date
  const [eDate, setEDate] = useState(''); // Add state for end date
  const [lStatus, setLStatus] = useState(''); // Add state for label status

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/systems/');
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `/api/systems/subsystems/${parentSystem.sysId}`
        );
        console.log('result:', result);
        setSubSystems(result.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (parentSystem && parentSystem.sysId) {
      // Add a check for parentSystem
      fetchData();
    }
  }, [parentSystem && parentSystem.sysId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tape/addTape', {
        tapeId,
        sysName: parentSystem.sysName,
        subSysName,
        bStatus,
        mType,
        tStatus,
        sDate,
        eDate,
        lStatus,
      });
      toast.success('New Tape has been created successfully!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate('/tape');
      window.location.reload();
    } catch (err) {
      toast.error(err.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };


  return (
    <Box
      width="100%"
      minHeight="20vh"
      p="3rem 0"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box sx={{ width: 450 }}>
        <Box
          width="100%"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyItems: 'center',
            alignItems: 'center',
            mb: '1.5rem',
          }}
        >
          <IconButton
            variant="solid"
            sx={{
              width: '40px',
              height: '40px',
              borderRadius: '100px',
              backgroundColor: colorPalette.yellow[500],
              color: colorPalette.black[500],
            }}
          >
            <PersonAddIcon />
          </IconButton>
          <Typography
            variant="h5"
            textAlign="center"
            sx={{ color: '#fff', mt: '1rem' }}
          >
            Add New Tape
          </Typography>
        </Box>
        <form onSubmit={submitHandler}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              name="tapeId"
              label="Tape ID"
              variant="outlined"
              type="text"
              sx={{
                mb: '1.5rem',

                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffe404',
                  },
                },

                '& .MuiInputLabel-outlined': {
                  color: '#fff',
                },
              }}
              onChange={(e) => setTapeId(e.target.value)}
              required
            />
            {/* <TextField
              name='sysName'
              label="System Name"
              variant="outlined"
              type="text"
              sx={{
                mb: '1.5rem',
                
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ffe404",
                  },
                },
               
                "& .MuiInputLabel-outlined": {
                  color: "#fff",
                },
              }}
              onChange={(e) => setSysName(e.target.value)}
              required
            /> */}

            <FormControl
              sx={{
                mb: '1.5rem',
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffe404',
                  },
                },
                '& .MuiInputLabel-outlined': {
                  color: '#fff',
                },
              }}
            >
              <InputLabel id="system-select-label">System</InputLabel>
              <Select
                labelId="system-select-label"
                value={parentSystem.sysName}
                label="System"
                onChange={(e) => {
                  const selectedSystem = systemData.find(
                    (system) => system.sysName === e.target.value
                  );
                  setParentSystem({
                    sysName: selectedSystem.sysName,
                    sysId: selectedSystem.sysId,
                  });
                }}
              >
                {systemData.map((system) => (
                  <MenuItem key={system.sysId} value={system.sysName}>
                    {system.sysName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              sx={{
                mb: '1.5rem',
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffe404',
                  },
                },
                '& .MuiInputLabel-outlined': {
                  color: '#fff',
                },
              }}
            >
              <InputLabel id="system-select-label">Sub System</InputLabel>
              <Select
                name="subSysName"
                value={subSysName}
                label="subSysName"
                onChange={(e) => setSubSysName(e.target.value)}
              >
                {subSystems ? (
                  subSystems.map((system) => (
                    <MenuItem key={system.subSysId} value={system.subSysName}>
                      {system.subSysName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="">
                    No sub systems available
                  </MenuItem>
                )}
              </Select>
            </FormControl>

            <TextField
              name="bStatus"
              label="Backup Status"
              variant="outlined"
              type="text"
              sx={{
                mb: '1.5rem',

                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffe404',
                  },
                },

                '& .MuiInputLabel-outlined': {
                  color: '#fff',
                },
              }}
              onChange={(e) => setBStatus(e.target.value)}
            />
            <TextField
              name="mType"
              label="Media Type"
              variant="outlined"
              type="text"
              sx={{
                mb: '1.5rem',

                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffe404',
                  },
                },

                '& .MuiInputLabel-outlined': {
                  color: '#fff',
                },
              }}
              onChange={(e) => setMType(e.target.value)}
            />
            <TextField
              name="tStatus"
              label="Tape Status"
              variant="outlined"
              type="text"
              sx={{
                mb: '1.5rem',

                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffe404',
                  },
                },

                '& .MuiInputLabel-outlined': {
                  color: '#fff',
                },
              }}
              onChange={(e) => setTStatus(e.target.value)}
            />
            <TextField
              name="sDate"
              label="Start Date"
              variant="outlined"
              type="date"
              sx={{
                mb: '1.5rem',

                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffe404',
                  },
                },

                '& .MuiInputLabel-outlined': {
                  color: '#fff',
                },
              }}
              onChange={(e) => setSDate(e.target.value)}
            />
            <TextField
              name="eDate"
              label="End Date"
              variant="outlined"
              type="date"
              sx={{
                mb: '1.5rem',

                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffe404',
                  },
                },

                '& .MuiInputLabel-outlined': {
                  color: '#fff',
                },
              }}
              onChange={(e) => setEDate(e.target.value)}
            />
            <TextField
              name="lStatus"
              label="Location Status"
              variant="outlined"
              type="text"
              sx={{
                mb: '1.5rem',

                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffe404',
                  },
                },

                '& .MuiInputLabel-outlined': {
                  color: '#fff',
                },
              }}
              onChange={(e) => setLStatus(e.target.value)}
            />

            <FlexBetween>
              <Button
                variant="filled"
                onClick={() => navigate('/staff')}
                sx={{
                  width: '45%',
                  backgroundColor: colorPalette.black2[500],
                  color: colorPalette.secondary[200],
                  padding: '0.5rem 0',
                  '&:hover': {
                    backgroundColor: colorPalette.black2[400],
                    color: colorPalette.secondary[200],
                  },
                }}
              >
                Cancel
              </Button>
              <br />
              <Button
                variant="filled"
                type="submit"
                sx={{
                  width: '45%',
                  backgroundColor: colorPalette.yellow[500],
                  color: colorPalette.black2[500],
                  padding: '0.5rem 0',
                  '&:hover': {
                    backgroundColor: colorPalette.yellow[400],
                    color: colorPalette.secondary[200],
                  },
                }}
              >
                Add new Tape
              </Button>
            </FlexBetween>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Tape;
