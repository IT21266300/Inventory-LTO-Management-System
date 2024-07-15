import React from 'react';
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddSubSystem = () => {

  const navigate = useNavigate()
  
  const [subsysName, setSubSysName] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/subsystems/addSubSystem', {
        subsysName,
      });
      toast.success('New data has been created successfully!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate('/subsystems');
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
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: colorPalette.black[500]}}
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
          <Typography variant="h5" textAlign="center" sx={{color: '#fff', mt: '1rem'}}>
            Add New Sub System
          </Typography>
        </Box>
        <form onSubmit={submitHandler}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
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
              onChange={(e) => setSubSysName(e.target.value)}
              required
            />

            <FlexBetween>
              <Button
                variant="filled"
                onClick={() => navigate('/subsystems')}
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
                type='submit'
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
                Add new Sub System
              </Button>
            </FlexBetween>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default AddSubSystem;
