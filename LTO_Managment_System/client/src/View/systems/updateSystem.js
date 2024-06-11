import React from 'react';
import Header from 'components/Header';
import Box from '@mui/material/Box';
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { colorPalette } from 'customTheme';
import FlexBetween from 'components/FlexBetween';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


// const teams = [
//   'Project Team',
//   'Revanue & Commercial Team',
//   'Warehouse Operation Team',
//   'Rollout Team',
//   'Document Team',
// ];

const UpdateSystem = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const { data } = location.state;

  console.log(data);

  const [formData, setFormData] = useState({
    sysId: '',
    sysName: '',
  });

  useEffect(() => {
    setFormData((prevState) => {
      let newData = { ...prevState };
      return {
        ...newData,
        sysId: data.sysId,
        sysName: data.sysName,
      };
    });
  }, [data]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/systems/updateSystem/${formData.sysId}`, formData);
      toast.success('Data has been updated successfully!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate('/systems');
    } catch (err) {
      toast.error(err.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Box
      width="100%"
      minHeight="20vh"
      p="3rem 0"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box>
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
            Update System
          </Typography>
        </Box>
        <form onSubmit={handleFormSubmit}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <TextField
              name="name"
              label="Name"
              variant="outlined"
              value={formData.sysName ? formData.sysName : ''}
              type="text"
              sx={{
                mb: '1.5rem',

                width: '100%',

                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffe404',
                  },
                },
                '& .MuiInputLabel-outlined': {
                  color: '#fff',
                },
                // "&.Mui-focused": {
                //   "& .MuiOutlinedInput-notchedOutline": {
                //     borderColor: "#ffe404",
                //     borderWidth: "3px",
                //   },
                // },
              }}
              onChange={handleChange}
              required
            />
            <TextField
              name="sysId"
              label="System ID"
              variant="outlined"
              type="text"
              value={formData.sysId ? formData.sysId : ''}
              sx={{
                mb: '1.5rem',
                color: colorPalette.yellow[500],

                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffe404',
                  },
                },

                '& .MuiInputLabel-outlined': {
                  color: '#fff',
                },
                '& .MuiInputBase-root.Mui-disabled': {
                  color: '#fff', // Change this to your desired text color
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  color: 'red', // Change this to your desired text color for the value
                },
                '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline':
                  {
                    borderColor: '#ffe404', // Change this to your desired outline color
                  },
              }}
              required
              onChange={handleChange}
              disabled
            />
            
            <FlexBetween
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
                // "&.Mui-focused": {
                //   "& .MuiOutlinedInput-notchedOutline": {
                //     borderColor: "#ffe404",
                //     borderWidth: "3px",
                //   },
                // },
              }}
            >
             
            </FlexBetween>
            <FlexBetween>
              <Button
                variant="filled"
                onClick={() => navigate('/systems')}
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
                    color: colorPalette.black[500],
                  },
                }}
              >
                Update System
              </Button>
            </FlexBetween>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default UpdateSystem;
