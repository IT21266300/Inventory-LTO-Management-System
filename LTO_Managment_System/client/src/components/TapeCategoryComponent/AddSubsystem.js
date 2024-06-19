import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { colorPalette } from 'customTheme';
import axios from 'axios';
import { toast } from 'react-toastify';
import textFieldStyles from 'styles/textFieldStyles';

const AddSubsystemPopup = ({
  open,
  onClose,
  systems,
  onSubsystemAdded,
  system,
}) => {
  const [formData, setFormData] = useState({
    subSysName: '',
    parentSystemId: '', // You might need to initialize this based on how your systems array is structured
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/systems/addSubSystem', formData); // Adjust the API endpoint if needed

      if (response.status === 200) {
        toast.success('Subsystem added successfully!', {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        setFormData({ subSysName: '', parentSystemId: '' });
        onSubsystemAdded(response.data.insertedId); // Notify parent about the new subsystem
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to add subsystem', {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add subsystem', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.error('Error adding subsystem:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      parentSystemId: system.sysId,
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ bgcolor: colorPalette.black[500], color: '#fff' }}>
        Add New Subsystem
      </DialogTitle>
      <DialogContent sx={{ background: colorPalette.black[500]}}>
        <form onSubmit={handleFormSubmit}>
          <TextField
            label="Subsystem Name"
            name="subSysName"
            value={formData.subSysName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={textFieldStyles}
          />

          <TextField
            label="Parent System"
            name="parentSystem"
            value={system && system.sysName}
            fullWidth
            margin="normal"
            required
            sx={{
              input: { color: '#fff' },
              label: { color: '#fff' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: colorPalette.yellow[500],
                },
                '&:hover fieldset': {
                  borderColor: colorPalette.yellow[600],
                },
                '&.Mui-focused fieldset': {
                  borderColor: colorPalette.yellow[700],
                },
              },
            }}
          />

          <DialogActions sx={{ background: colorPalette.black[500], mt: 2 }}>
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
              Add Subsystem
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubsystemPopup;
