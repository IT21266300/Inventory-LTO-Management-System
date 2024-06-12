import React, { useState } from 'react';
import Box from '@mui/material/Box';
import {
  Button,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { colorPalette } from 'customTheme';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FlexBetween from 'components/FlexBetween';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const AddNewSystemPopup = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [sysName, setSysName] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/systems/addSystem', {
        sysName,
      });
      toast.success('New system has been created successfully!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      onClose(); // Close the popup
      window.location.reload(); // You might want to refresh your system list
    } catch (err) {
      toast.error(err.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ bgcolor: colorPalette.black1[400], color: '#fff' }}>Add New System</DialogTitle>
      <DialogContent sx={{ bgcolor: colorPalette.black1[400] }}>
        <Box
          width="450px" // Adjust width as needed
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
          <Typography variant="h5" textAlign="center" sx={{ color: '#fff', mt: '1rem' }}>
            Add New System
          </Typography>
        </Box>
        <form onSubmit={submitHandler}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              name="sysName"
              label="System Name"
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
              onChange={(e) => setSysName(e.target.value)}
              required
            />
            <DialogActions>
              <Button onClick={onClose} 
              sx={{
                width: '45%',
                backgroundColor: colorPalette.black2[500],
                color: colorPalette.secondary[200],
                padding: '0.5rem 0',
                '&:hover': {
                  backgroundColor: colorPalette.black2[400],
                  color: colorPalette.secondary[200],
                },
              }}>
                Cancel
              </Button>
              <Button type="submit"
               sx={{
                width: '45%',
                backgroundColor: colorPalette.yellow[500],
                color: colorPalette.black2[500],
                padding: '0.5rem 0',
                '&:hover': {
                  backgroundColor: colorPalette.yellow[400],
                  color: colorPalette.secondary[200],
                },
              }}>
                Add System
              </Button>
            </DialogActions>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewSystemPopup;