// AddNewStock.js
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import {
  Button,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { colorPalette } from 'customTheme';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';
import { toast } from 'react-toastify';
import textFieldStyles from 'styles/textFieldStyles';

const AddNewStock = () => {
  const [tapeName, setTapeName] = useState('');
  const [tapeQuantity, setTapeQuantity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/inventory/addstock', {
        tapeName,
        tapeQuantity: parseInt(tapeQuantity, 10), // Ensure quantity is an integer
        lastUpdate:localStorage.getItem('staffId')
      });

      console.log('id', localStorage.getItem.staffId);
      
      if (response.status === 200) {
        toast.success('New stock added successfully!', {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        window.location.reload();
        // Reset form fields or perform any other actions after successful submission
        setTapeName('');
        setTapeQuantity('');
      } else {
        toast.error('Failed to add stock. Please try again later.', {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      toast.error('An error occurred while adding stock.', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#fff'
      }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3}}>
            <FormControl fullWidth sx={textFieldStyles}>
          <InputLabel id="tapeName-label">
            Tape Name
          </InputLabel>
          <Select
            labelId="tapeName-label"
            id="tapeName"
            value={tapeName}
            label="Tape Name"
            onChange={(e) => setTapeName(e.target.value)}
          >
            <MenuItem value="LTO5">LTO5</MenuItem>
            <MenuItem value="LTO6">LTO6</MenuItem>
            <MenuItem value="LTO7">LTO7</MenuItem>
            <MenuItem value="LTO8">LTO8</MenuItem>
            <MenuItem value="LTO9">LTO9</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Quantity"
          type="text" // Use type="number" for quantity input
          id="tapeQuantity"
          value={tapeQuantity}
          onChange={(e) => setTapeQuantity(e.target.value)}
          sx={textFieldStyles}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: colorPalette.yellow[500],
            color: '#000',
            '&:hover': {
              backgroundColor: colorPalette.yellow[600],
            },
          }}
        >
          Add Stock
        </Button>
      </Box>
    </Box>
  );
};

export default AddNewStock;