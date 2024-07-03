import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Button, IconButton, TextField, Typography } from '@mui/material';
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
import textFieldStyles from 'styles/textFieldStyles';

const SelectTapeStock = ({ open, onClose, tapeId }) => {
  const navigate = useNavigate();
  const [tapeReuse, setTapeReuse] = useState('');
  const [showReuseForm, setShowReuseForm] = useState(false); // Track if reuse form is visible

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Update the tape record with tapeReuse and set reuseTape to true
      await axios.put('/api/tape', {
        _id: tapeId, // Assuming you have the tapeId available
        tapeReuse,
        reuseTape: true // Set reuseTape to true
      });
      toast.success('Reuse Tape, data has been updated successfully!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      onClose();
      window.location.reload();
    } catch (err) {
      toast.error(err.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ bgcolor: colorPalette.black[500], color: '#fff' }}>
        Select Tape Stock
      </DialogTitle>
      <DialogContent sx={{ bgcolor: colorPalette.black[500] }}>
        <Button
          onClick={() => {
            navigate('/newTape');
          }}
          variant="outlined"
          sx={{ color: '#fff', borderColor: '#fff' }}
        >
          New Tape
        </Button>
        <Button
          onClick={() => setShowReuseForm(true)} // Show the reuse form
          variant="contained"
          sx={{
            bgcolor: colorPalette.yellow[500],
            '&:hover': { bgcolor: colorPalette.yellow[600] },
          }}
        >
          Reuse Tape
        </Button>

        {showReuseForm && ( // Show the reuse form if showReuseForm is true
          <form onSubmit={submitHandler}>
            <TextField
              name="tapeReuse"
              label="Tape Content"
              variant="outlined"
              multiline
              rows={4}
              sx={textFieldStyles}
              onChange={(e) => setTapeReuse(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: colorPalette.green[500],
                '&:hover': { bgcolor: colorPalette.green[600] },
              }}
            >
              Update Tape
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SelectTapeStock;