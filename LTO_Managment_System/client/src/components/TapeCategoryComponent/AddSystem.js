import React, { useState } from 'react';
import { Button,TextField } from '@mui/material';
import { colorPalette } from 'customTheme';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import textFieldStyles from 'styles/textFieldStyles';

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
      <DialogTitle sx={{ bgcolor: colorPalette.black[500], color: '#fff', width: '450px' }}>
        Add New System
      </DialogTitle>
      <DialogContent sx={{ bgcolor: colorPalette.black[500] }}>
        <form onSubmit={submitHandler}>
            <TextField
              name="sysName"
              label="System Name"
              variant="outlined"
              type="text"
              sx={textFieldStyles}
              onChange={(e) => setSysName(e.target.value)}
              required
            />
            <DialogActions>
              <Button
                onClick={onClose}
                variant="outlined"
                sx={{ color: '#fff', borderColor: '#fff' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: colorPalette.yellow[500],
                  '&:hover': { bgcolor: colorPalette.yellow[600] },
                }}
              >
                Add System
              </Button>
            </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
    
  );
};

export default AddNewSystemPopup;
