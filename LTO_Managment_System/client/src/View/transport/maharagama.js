import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Chip,
} from '@mui/material';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import DeleteIcon from '@mui/icons-material/Delete';

const Maharagama = () => {
  const [locationStatus, setLocationStatus] = useState('');
  const [tapeIds, setTapeIds] = useState([]);
  const [inputTapeId, setInputTapeId] = useState('');

  const handleAddTapeId = () => {
    if (inputTapeId && !tapeIds.includes(inputTapeId)) {
      setTapeIds([...tapeIds, inputTapeId]);
      setInputTapeId('');
    } else {
      toast.error('Tape ID is either empty or already added.', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const handleRemoveTapeId = (id) => {
    setTapeIds(tapeIds.filter((tapeId) => tapeId !== id));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put('/api/tape/updateTapeStatuses', {
        tapeIds,
        lStatus: locationStatus,
      });

      // Download PDF after submission
      const doc = new jsPDF();
      doc.text('Tape Status Update', 20, 20);
      doc.text(`Location Status: ${locationStatus}`, 20, 30);
      doc.text('Tape IDs:', 20, 40);
      tapeIds.forEach((tapeId, index) => {
        doc.text(`${index + 1}. ${tapeId}`, 20, 50 + index * 10);
      });
      doc.save('TapeStatusUpdate.pdf');

      toast.success('Tape statuses updated successfully!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (err) {
      toast.error(err.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  return (
    <Box sx={{ padding: '2rem' }}>
      <Paper
        elevation={3}
        sx={{
          padding: '2rem',
          borderRadius: '10px',
          backgroundColor: '#333',
          color: '#fff',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Update Tape Status
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Location Status:
            </Typography>
            <Select
              value={locationStatus}
              onChange={(e) => setLocationStatus(e.target.value)}
              fullWidth
              sx={{
                backgroundColor: '#444',
                color: '#fff',
                border: '1px solid #ffe404',
              }}
            >
              <MenuItem value={'HO'}>Head Office</MenuItem>
              <MenuItem value={'DRN'}>DR Nugegoda</MenuItem>
              <MenuItem value={'DRP'}>DR Pitipana</MenuItem>
              
            </Select>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="subtitle1" gutterBottom>
              Enter Tape IDs:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                value={inputTapeId}
                onChange={(e) => setInputTapeId(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTapeId();
                    e.preventDefault();
                  }
                }}
                placeholder="Enter Tape ID and press Enter"
                fullWidth
                sx={{
                  backgroundColor: '#444',
                  color: '#fff',
                  input: { color: '#fff' },
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddTapeId}
                sx={{
                  marginLeft: '10px',
                  backgroundColor: '#ffe404',
                  color: '#333',
                }}
              >
                Add
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ marginTop: '1rem' }}>
          {tapeIds.map((tapeId, index) => (
            <Chip
              key={index}
              label={tapeId}
              onDelete={() => handleRemoveTapeId(tapeId)}
              deleteIcon={<DeleteIcon />}
              sx={{
                backgroundColor: '#555',
                color: '#fff',
                margin: '5px',
              }}
            />
          ))}
        </Box>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            marginTop: '2rem',
            backgroundColor: '#ffe404',
            color: '#333',
          }}
        >
          Submit and Download PDF
        </Button>
      </Paper>
    </Box>
  );
};

export default Maharagama;



















