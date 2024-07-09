// AddNewStock.js
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import {
  Button,
  IconButton,
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

const AddNewStock = () => {
  const [tapeName, setTapeName] = useState('');
  const [tapeQuantity, setTapeQuantity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/inventory/addstock', {
        tapeName,
        tapeQuantity: parseInt(tapeQuantity, 10), // Ensure quantity is an integer
      });

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
        mt: 5,
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: '#000' }}>
        Add New Tape Stock
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '50%' }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="tapeName-label" sx={{ color: '#000' }}>
            Tape Name
          </InputLabel>
          <Select
            labelId="tapeName-label"
            id="tapeName"
            value={tapeName}
            label="Tape Name"
            onChange={(e) => setTapeName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#000', // Change the border color here
                },
                '&:hover fieldset': {
                  borderColor: colorPalette.yellow[500],
                },
                '&.Mui-focused fieldset': {
                  borderColor: colorPalette.yellow[500],
                },
              },
              '& .MuiInputLabel-root': {
                color: '#000',
              },
            }}
          >
            <MenuItem value="LTO6">LTO6</MenuItem>
            <MenuItem value="LTO7">LTO7</MenuItem>
            <MenuItem value="LTO8">LTO8</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Quantity"
          type="text" // Use type="number" for quantity input
          id="tapeQuantity"
          value={tapeQuantity}
          onChange={(e) => setTapeQuantity(e.target.value)}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              color: '#000',
              '& fieldset': {
                borderColor: '#000', // Change the border color here
              },
              '&:hover fieldset': {
                borderColor: colorPalette.yellow[500],
              },
              '&.Mui-focused fieldset': {
                borderColor: colorPalette.yellow[500],
              },
            },
            '& .MuiInputLabel-root': {
              color: '#000',
            },
          }}
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
          <AddCircleIcon sx={{ mr: 1 }} /> Add Stock
        </Button>
      </Box>
    </Box>
  );
};

export default AddNewStock;