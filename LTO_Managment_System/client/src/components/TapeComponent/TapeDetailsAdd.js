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

const AddNewTapePopup = ({ open, onClose}) => {
  const navigate = useNavigate();
  const [tapeContent, setTapeContent] = useState('');
  const [date, setDate] = useState('');
  const [remarks, setRemarks] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tape/addTapeDetails', {
         // Pass the systemId received as a prop
        tapeContent,
        date,
        remarks,
      });
      toast.success('Tape data has been added successfully!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      onClose(); // Close the popup
      window.location.reload(); // You might want to refresh your tape list
    } catch (err) {
      toast.error(err.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
     
      <DialogContent sx={{ bgcolor: colorPalette.black[500] }}>
        <form onSubmit={submitHandler}>
          <TextField
            name="tapeContent"
            label="Tape Content"
            variant="outlined"
            multiline
            rows={4}
            sx={textFieldStyles}
            onChange={(e) => setTapeContent(e.target.value)}
            required
          />
          <TextField
            name="date"
            label="Date"
            variant="outlined"
            type="date"
            sx={textFieldStyles}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <TextField
            name="remarks"
            label="Remarks"
            variant="outlined"
            multiline
            rows={4}
            sx={textFieldStyles}
            onChange={(e) => setRemarks(e.target.value)}
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
              Add Tape
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewTapePopup;