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
    subSysName: '', 
    parentSystemId: '',
  });

  console.log(systemData);

  useEffect(() => {
    // Update form data when systemData changes (e.g., popup is opened with new data)
    if (systemData) {
      setFormData({
        subSysName: systemData.subsysName, 
        parentSystemId: systemData.parentID,
      });
    }
  }, [systemData]); 

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/systems/updateSubSystem/${systemData.subsysId}`, formData);
      toast.success('Data has been updated successfully!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      onUpdateSuccess(); // Notify the parent component of successful update
      onClose();
      window.location.reload();
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
      <DialogTitle sx={{ bgcolor: colorPalette.black[500], color: '#fff'}}>
        <Typography variant="h6" align="center">
          Update Sub System
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: colorPalette.black[500]}}>
        <form onSubmit={handleFormSubmit}>
          <TextField
            name="subSysName"
            label="Sub System Name"
            variant="outlined"
            value={formData.subSysName} 
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
            name="parentId"
            label="Parent System ID"
            variant="outlined"
            value={formData.parentSystemId}
            fullWidth
            margin="normal"
             
            sx={{
              '& .MuiOutlinedInput-root': { color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ffe404' } },
              '& .MuiInputLabel-outlined': { color: '#fff' },
              '& .MuiInputBase-root.Mui-disabled': { color: '#fff' },
              '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: '#ffe404' },
            }}
          />

          <DialogActions sx={{ bgcolor: colorPalette.black[500], mt: 2 }}>
            <Button onClick={onClose} variant="outlined" sx={{ color: colorPalette.secondary[200], borderColor: colorPalette.secondary[200] }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: colorPalette.yellow[500], '&:hover': { bgcolor: colorPalette.yellow[600] } }}>
              Update Sub System
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSystemPopup;
