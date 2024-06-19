import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { colorPalette } from 'customTheme';

const TapeDetails = () => {
  const { tapeId } = useParams();
  const location = useLocation();
  const tapeData = location.state?.data; 

  const [tape, setTape] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTapeDetails = async () => {
      try {
        const response = await axios.get(`/api/tape/${tapeId}`); 
        setTape(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTapeDetails();
  }, [tapeId]); 

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <Button
          variant="contained"
          startIcon={<ArrowBackIosNewIcon />}
          onClick={handleGoBack}
          sx={{
            backgroundColor: colorPalette.secondary[100],
            color: colorPalette.black[500],
            '&:hover': {
              backgroundColor: colorPalette.black[400],
              color: colorPalette.secondary[100],
            },
            mr: '1rem', // Add some margin to the right
          }}
        >
          <Typography fontSize="0.9rem">Go Back</Typography>
        </Button>

        <Typography
          variant="h4"
          sx={{ color: colorPalette.black[500], fontWeight: 'bold' }}
        >
          Tape Details
        </Typography>
      </Box>

      <Divider
        sx={{
          backgroundColor: colorPalette.primary[500],
          height: '2px',
          margin: '0 20px',
        }}
      />
      <Box sx={{ flexGrow: 1, padding: '20px' }}>
        <Paper elevation={3} sx={{ padding: '20px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 'bold', color: colorPalette.black[500] }}
              >
                Tape ID:
              </Typography>
              <Typography variant="body2">{tape.tapeId}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 'bold', color: colorPalette.black[500] }}
              >
                System Name:
              </Typography>
              <Typography variant="body2">{tape.sysName}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 'bold', color: colorPalette.black[500] }}
              >
                Application Name:
              </Typography>
              <Typography variant="body2">{tape.subSysName}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 'bold', color: colorPalette.black[500] }}
              >
                Backup Status:
              </Typography>
              <Typography variant="body2">{tape.bStatus}</Typography>
            </Grid>
            {/* Add more fields as needed */}
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default TapeDetails;