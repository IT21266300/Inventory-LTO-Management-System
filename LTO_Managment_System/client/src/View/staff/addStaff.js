import React from 'react';
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

const positions = [
  'Admin',
  'Operator',
  'Read Only',
];

// const teams = [
//   'Project Team',
//   'Revanue & Commercial Team',
//   'Warehouse Operation Team',
//   'Rollout Team',
//   'Document Team',
// ];

const Profile = () => {

  const navigate = useNavigate()
  const [staffId, setStaffId] = useState();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [password, setPassword] = useState('');

  console.log(position);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/staff/add', {
        staffId,
        name,
        phone,
        position,
        password,
      });
      toast.success('New data has been created successfully!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate('/staff');
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
              backgroundColor: colorPalette.primary[500],
              color: colorPalette.secondary[100],
              '&:hover': {
                backgroundColor: colorPalette.primary[500],
                color: colorPalette.secondary[100],
              },
            }}
          >
            <PersonAddIcon />
          </IconButton>
          <Typography variant="h5" textAlign="center">
            Add New Staff Member
          </Typography>
        </Box>
        <form onSubmit={submitHandler}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              name='name'
              label="Name"
              variant="outlined"
              type="text"
              sx={{ mb: '1.5rem' }}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              name='staffId'
              label="User ID"
              variant="outlined"
              type="text"
              sx={{ mb: '1.5rem' }}
              required
              onChange={(e) => setStaffId(e.target.value)}
            />
             <TextField
              name="phone"
              label="Phone"
              variant="outlined"
              type="text"
              required
              sx={{ mb: '1.5rem' }}
              onChange={(e) => setPhone(e.target.value)}
            />
            <TextField
              name='password'
              label="Password"
              variant="outlined"
              type="password"
              sx={{ mb: '1.5rem' }}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            
           
            <FlexBetween sx={{ mb: '1.5rem' }}>
              <FormControl sx={{width: '45%'}}>
                <InputLabel id="demo-simple-select-label">Position</InputLabel>
                <Select
                  name="position"
                  value={position}
                  label="User Type"
                  onChange={(e) => setPosition(e.target.value)}
                >
                  {positions.map((position) => (
                    <MenuItem
                    key={position}
                    value={position}
                  >
                    {position}
                  </MenuItem>
                  ))}
                </Select>
              </FormControl>
              

            </FlexBetween>
            <FlexBetween>
              <Button
                variant="filled"
                onClick={() => navigate('/staff')}
                sx={{
                  width: '45%',
                  backgroundColor: colorPalette.indigo[500],
                  color: colorPalette.secondary[200],
                  padding: '0.5rem 0',
                  '&:hover': {
                    backgroundColor: colorPalette.indigo[700],
                    color: colorPalette.secondary[200],
                  },
                }}
              >
                Cancel
              </Button>
              <br />
              <Button
                variant="filled"
                type='submit'
                sx={{
                  width: '45%',
                  backgroundColor: colorPalette.primary[500],
                  color: colorPalette.secondary[200],
                  padding: '0.5rem 0',
                  '&:hover': {
                    backgroundColor: colorPalette.primary[700],
                    color: colorPalette.secondary[200],
                  },
                }}
              >
                Add new Member
              </Button>
            </FlexBetween>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Profile;