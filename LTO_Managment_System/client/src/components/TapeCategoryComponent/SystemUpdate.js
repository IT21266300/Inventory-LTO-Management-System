import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from '@mui/material';
import { colorPalette } from 'customTheme';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateSystemPopup = ({ systemData, open, onClose, onUpdateSuccess }) => { // Accept props for data and control
  const [formData, setFormData] = useState({
    sysId: '',
    sysName: '', 
  });

  useEffect(() => {
    // Update form data when systemData changes (e.g., popup is opened with new data)
    if (systemData) {
      setFormData({
        sysId: systemData.sysId,
        sysName: systemData.sysName, 
      });
    }
  }, [systemData]); 

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/systems/updateSystem/${formData.sysId}`, formData);
      toast.success('Data has been updated successfully!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      onUpdateSuccess(); // Notify the parent component of successful update
      onClose(); 
    } catch (err) {
      toast.error(err.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} >
      <DialogTitle sx={{ bgcolor: colorPalette.black1[400], color: '#fff'}}>
        <Typography variant="h6" align="center">
          Update System
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: colorPalette.black1[400]}}>
        <form onSubmit={handleFormSubmit}>
          <TextField
            name="sysName"
            label="Name"
            variant="outlined"
            value={formData.sysName} 
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': { color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ffe404' } },
              '& .MuiInputLabel-outlined': { color: '#fff' },
            }}
            required
          />
          {/* Assuming sysId should not be editable */}
          <TextField
            name="sysId"
            label="System ID"
            variant="outlined"
            value={formData.sysId}
            fullWidth
            margin="normal"
            disabled 
            sx={{
              '& .MuiOutlinedInput-root': { color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ffe404' } },
              '& .MuiInputLabel-outlined': { color: '#fff' },
              '& .MuiInputBase-root.Mui-disabled': { color: '#fff' },
              '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: '#ffe404' },
            }}
          />

          <DialogActions sx={{ bgcolor: colorPalette.black1[400], mt: 2 }}>
            <Button onClick={onClose} variant="outlined" sx={{ color: colorPalette.secondary[200], borderColor: colorPalette.secondary[200] }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: colorPalette.yellow[500], '&:hover': { bgcolor: colorPalette.yellow[600] } }}>
              Update System
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSystemPopup;