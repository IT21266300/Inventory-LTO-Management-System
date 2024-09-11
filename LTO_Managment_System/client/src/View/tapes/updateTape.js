import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import {
  Button,
  IconButton,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { colorPalette } from 'customTheme';
import FlexBetween from 'components/FlexBetween';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useReducer } from 'react';
import textFieldStyles from 'styles/textFieldStyles';
import SdStorageIcon from '@mui/icons-material/SdStorage';

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

  const location = useLocation();

  const { data } = location.state;

  console.log(data);

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
  const [sStatus, setSStatus] = useState(''); // Add state for special status

  console.log(data);

  useEffect(() => {
    setTapeId(data.tapeId);
    setParentSystem((prevState) => ({
      ...prevState,
      sysName: data.sysName,
      sysId: data.sysId,
    }));
    setSubSysName(data.subSysName);
    setBStatus(data.bStatus);
    setMType(data.mType);
    setTStatus(data.tStatus);
    // setSDate(data.sDate);
    setEDate(data.eDate);
    setLStatus(data.lStatus);
    setSStatus(data.sStatus);
  }, [data]);

  useEffect(() => {
    const isoSDate = data.sDate;
    const isoEDate = data.eDate;
    const startDate = new Date(isoSDate);
    const endDate = new Date(isoEDate);
    const formattedSDate = startDate.toISOString().split('T')[0];
    const formattedEDate = endDate.toISOString().split('T')[0];
    setSDate(formattedSDate);
    setEDate(formattedEDate);
  }, []);

  console.log(parentSystem.sysName);

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
        setSubSystems(null);
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
      await axios.put(`/api/tape/updateTape/${data.tapeId}`, {
        sysId: parentSystem.sysId,
        sysName: parentSystem.sysName,
        subSysName,
        bStatus,
        mType,
        tStatus,
        sDate,
        eDate,
        lStatus,
        sStatus,
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

  console.log(parentSystem);
  console.log(subSystems);

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
              '&:hover': {
                backgroundColor: colorPalette.yellow[500],
                color: colorPalette.black[500],
              },
            }}
          >
            <SdStorageIcon/>
          </IconButton>
          <Typography
            variant="h5"
            textAlign="center"
            sx={{ color: '#fff', mt: '1rem' }}
          >
            Update Tape
          </Typography>
        </Box>
        <form onSubmit={submitHandler}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              name="tapeId"
              label="Tape ID"
              variant="outlined"
              type="text"
              value={tapeId}
              sx={textFieldStyles}
              onChange={(e) => setTapeId(e.target.value)}
              required
            />

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: '1.5rem',
              }}
            >
              <FormControl sx={textFieldStyles}>
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
                    axios
                      .get(`/api/systems/subsystems/${selectedSystem.sysId}`)
                      .then((response) => {
                        setSubSystems(response.data);
                      })
                      .catch((error) => {
                        console.log(error);
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

              {subSystems && (
                <FormControl sx={textFieldStyles}>
                  <InputLabel id="system-select-label">Sub System</InputLabel>
                  <Select
                    name="subSysName"
                    value={subSysName}
                    label="subSysName"
                    onChange={(e) => setSubSysName(e.target.value)}
                  >
                    {subSystems ? (
                      subSystems.map((system) => (
                        <MenuItem
                          key={system.subSysId}
                          value={system.subSysName}
                        >
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
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: '1.5rem',
              }}
            >
              <FormControl sx={textFieldStyles}>
                <InputLabel id="demo-simple-select-label">
                  Backup Status
                </InputLabel>
                <Select
                  name="bStatus"
                  value={bStatus}
                  label="Backup Status"
                  id="bStatus" // Added id
                  onChange={(e) => setBStatus(e.target.value)} // Corrected onChange handler
                >
                  <MenuItem value={'Full'}>Full</MenuItem>
                  <MenuItem value={'Failed'}>Failed</MenuItem>
                  <MenuItem value={'In Progress'}>In Progress</MenuItem>
                  <MenuItem value={'Not Taken'}>Not Taken</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={textFieldStyles}>
                <InputLabel id="demo-simple-select-label">
                  Media Type
                </InputLabel>
                <Select
                  name="mType"
                  value={mType}
                  label="Media Type"
                  onChange={(e) => setMType(e.target.value)}
                >
                  <MenuItem value={'LTO5'}>LTO5</MenuItem>
                  <MenuItem value={'LTO6'}>LTO6</MenuItem>
                  <MenuItem value={'LTO7'}>LTO7</MenuItem>
                  <MenuItem value={'LTO8'}>LTO8</MenuItem>
                  <MenuItem value={'LTO9'}>LTO9</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <FormControl sx={textFieldStyles}>
              <InputLabel id="demo-simple-select-label">Tape Status</InputLabel>
              <Select
                name="tStatus"
                value={tStatus}
                label="Tape Status"
                id="tStatus" // Added id
                onChange={(e) => setTStatus(e.target.value)} // Corrected onChange handler
              >
                <MenuItem value={'Full'}>Full</MenuItem>
                <MenuItem value={'In Use'}>In Use</MenuItem>
              </Select>
            </FormControl>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: '1.5rem',
              }}
            >
              <TextField
                name="sDate"
                label="Start Date" // Updated label
                variant="outlined"
                type="date" // Changed to datetime-local
                InputLabelProps={{
                  shrink: true,
                }}
                value={sDate}
                sx={textFieldStyles}
                onChange={(e) => setSDate(e.target.value)}
                // aria-readonly
              />

              <TextField
                name="eDate"
                label="End Date" // Updated label
                variant="outlined"
                value={eDate}
                type="date" // Changed to datetime-local
                InputLabelProps={{
                  shrink: true,
                }}
                sx={textFieldStyles}
                onChange={(e) => setEDate(e.target.value)}
                // aria-readonly
              />

            </Box>

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
              <InputLabel id="demo-simple-select-label">
                Location Status
              </InputLabel>
              <Select
                name="lStatus"
                value={lStatus}
                label="Location Status"
                id="lStatus"
                onChange={(e) => setLStatus(e.target.value)} // Corrected onChange handler
              >
                <MenuItem value={'HO'}>Head Office</MenuItem>
                <MenuItem value={'DRN'}>DR Nugegoda</MenuItem>
                <MenuItem value={'DRM'}>DR Maharagama</MenuItem>
                <MenuItem value={'HO->DRN'}>HO to DRN</MenuItem>
                <MenuItem value={'DRN->DRM'}>DRN to DRM</MenuItem>
                <MenuItem value={'DRM->DRN'}>DRM to DRN</MenuItem>
                <MenuItem value={'DRN->HO'}>DRN to HO</MenuItem>
                <MenuItem value={'DRM->HO'}>DRM to HO</MenuItem>
                <MenuItem value={'HO->DRM'}>HO to DRM</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={textFieldStyles}>
              <InputLabel id="demo-simple-select-label">
                Special Status
              </InputLabel>
              <Select
                name="sStatus"
                value={sStatus}
                label="Special Status"
                id="sStatus"
                onChange={(e) => setSStatus(e.target.value)} // Corrected onChange handler
              >
                <MenuItem value={"Permanent"}>Permanent</MenuItem>
                <MenuItem value={"Entire System"}>Entire System</MenuItem>
                <MenuItem value={"Weekly"}>Weekly</MenuItem>
                <MenuItem value={"Monthly"}>Monthly</MenuItem>
              </Select>
            </FormControl>

            <FlexBetween>
              <Button
                onClick={() => navigate('/tape')}
                sx={{
                  width: '45%',
                  color: colorPalette.secondary[100],
                  padding: '0.5rem 0',
                  borderColor: '#fff'
                }}
                variant="outlined"
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
                  },
                }}
              >
                Update Tape
              </Button>
            </FlexBetween>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Tape;
