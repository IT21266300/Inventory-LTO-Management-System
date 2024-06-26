import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { LoadingAnimation } from 'components/LoadingComponent/LoadingAnimationTwo';
import { toast } from 'react-toastify';
import { colorPalette } from 'customTheme';

import AddNewTapePopup from '../../components/TapeComponent/TapeDetailsAdd'; // Assuming your popup component is called AddNewTapePopup

import textFieldSubStyles from 'styles/textFieldSubStyles';
import textFieldStyles from 'styles/textFieldStyles';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import TapeContent from 'components/TapeComponent/TapeContent';

const ViewTape = () => {
  const navigate = useNavigate();
  const { tapeId } = useParams();
  const [tapeData, setTapeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for updating status
  const [backupStatus, setBackupStatus] = useState(null);
  const [tapeStatus, setTapeStatus] = useState(null);
  const [locationStatus, setLocationStatus] = useState(null);

  // State for the Add New Tape Popup
  const [addNewTapePopupOpen, setAddNewTapePopupOpen] = useState(false);

  useEffect(() => {
    const fetchTapeData = async () => {
      try {
        const response = await axios.get(`/api/tape/${tapeId}`);
        setTapeData(response.data[0]);

        // Initialize update states with current values
        setBackupStatus(response.data[0].bStatus);
        setTapeStatus(response.data[0].tStatus);
        setLocationStatus(response.data[0].lStatus);
      } catch (err) {
        setError(err.message);
        toast.error(err.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTapeData();
  }, [tapeId]);

  if (loading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        Error: {error}
      </Typography>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const handleUpdateStatus = async () => {
    try {
      const response = await axios.put(`/api/tape/updateTapeStatus/${tapeId}`, {
        bStatus: backupStatus,
        tStatus: tapeStatus,
        lStatus: locationStatus,
      });

      // Assuming your API returns the updated data
      setTapeData(response.data);

      toast.success('Status updated successfully!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      window.location.reload();
    } catch (err) {
      toast.error(err.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.error(err);
    }
  };

  const handleAddNewTapeDetails = () => {
    setAddNewTapePopupOpen(true);
  };

  const handleCloseAddNewTapePopup = () => {
    setAddNewTapePopupOpen(false);
  };

  return (
    <Box
      sx={{
        padding: '2rem',
      }}
    >
      <Box sx={{marginBottom: '1rem'}}>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: colorPalette.yellow[500],
            color: colorPalette.black[900],
          }}
        >
          Back to Tape
        </Button>
      </Box>
      {/* top component */}
      <Box>
        {/* Your other component goes here */}
        <Paper
          elevation={3}
          sx={{
            padding: '2rem',
            marginBottom: '2rem',
            borderRadius: '10px',
            backgroundColor: colorPalette.black1[500],
            color: '#fff',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Update Tape Status
          </Typography>

          <Grid
            container
            spacing={4}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" gutterBottom>
                Backup Status:
              </Typography>
              <Select
                value={backupStatus}
                onChange={(e) => setBackupStatus(e.target.value)}
                fullWidth
                sx={{
                  backgroundColor: colorPalette.black1[400],
                  color: '#fff',
                }}
              >
                 <MenuItem value={'Completed'}>Completed</MenuItem>
                  <MenuItem value={'Failed'}>Failed</MenuItem>
                  <MenuItem value={'In Progress'}>In Progress</MenuItem>
                  <MenuItem value={'Not Taken'}>Not Taken</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" gutterBottom>
                Tape Status:
              </Typography>
              <Select
                value={tapeStatus}
                onChange={(e) => setTapeStatus(e.target.value)}
                fullWidth
                sx={{
                  backgroundColor: colorPalette.black1[400],
                  color: '#fff',
                }}
              >
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Ongoing">Ongoing</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" gutterBottom>
                Location Status:
              </Typography>
              <Select
                value={locationStatus}
                onChange={(e) => setLocationStatus(e.target.value)}
                fullWidth
                sx={{
                  backgroundColor: colorPalette.black1[400],
                  color: '#fff',
                }}
              >
                <MenuItem value={'HO'}>Head Office</MenuItem>
                <MenuItem value={'DRN'}>DR Nugegoda</MenuItem>
                <MenuItem value={'DRM'}>DR Maharagama</MenuItem>
                <MenuItem value={'HO->DRN'}>HO to DRN</MenuItem>
                <MenuItem value={'DRN->DRM'}>DRN to DRM</MenuItem>
                <MenuItem value={'DRM->DRN'}>DRM to DRN</MenuItem>
                <MenuItem value={'DRN->HO'}>DRN to HO</MenuItem>
                <MenuItem value={'DRM->HO'}>DRM to HO</MenuItem>
                <MenuItem value={'HO->DRM'}>HO to DRM</MenuItem>
              </Select>
            </Grid>

            <Grid
              item
              xs={12}
              md={2}
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                variant="contained"
                onClick={handleUpdateStatus}
                sx={{
                  backgroundColor: colorPalette.yellow[500],
                  color: colorPalette.black[900],
                  marginTop: '1.5rem',
                }}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* bottom component */}
      <Box>
        <Typography variant="h5" gutterBottom sx={{color: '#fff'}}>
          Tape Details
        </Typography>
        
        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
          <Box>
            {tapeData && (
              <Paper
                elevation={3}
                sx={{
                  padding: '2rem',
                  marginBottom: '2rem',
                  borderRadius: '10px',
                  backgroundColor: colorPalette.black1[500],
                }}
              >
                  <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: '1rem',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        color: '#fff',
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom>
                        Tape ID :
                        <span style={{ fontSize: '1.3rem', marginLeft: '0.4rem', color: '#fff' }}>
                          {tapeData.tapeId}
                        </span>
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: '1rem',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        color: '#fff'
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom>
                        System Name:
                        <span style={{ fontWeight: 'bold' }}>
                          {tapeData.sysName}
                        </span>
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: '1rem',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: '#fff'}}>
                        Application Name:
                        <span style={{ fontWeight: 'bold', color: '#fff' }}>
                          {tapeData.subSysName}
                        </span>
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: '1rem',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: '#fff'}}>
                        Backup Status:
                        <span style={{ fontWeight: 'bold', color: '#fff' }}>
                          {tapeData.bStatus}
                        </span>
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: '1rem',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: '#fff'}}>
                        Media Type:
                        <span style={{ fontWeight: 'bold', color: '#fff' }}>{tapeData.mType}</span>
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: '1rem',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: '#fff'}}>
                        Tape Status:
                        <span style={{ fontWeight: 'bold', color: '#fff' }}>
                          {tapeData.tStatus}
                        </span>
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: '1rem',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: '#fff'}}>
                        Start Date:
                        <span style={{ fontWeight: 'bold', color: '#fff' }}>
                          {formatDate(tapeData.sDate)}
                        </span>
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: '1rem',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: '#fff'}}>
                        End Date:
                        <span style={{ fontWeight: 'bold', color: '#fff' }}>
                          {formatDate(tapeData.eDate)}
                        </span>
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: '1rem',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: '#fff'}}>
                        Location Status : 
                        <span style={{ fontWeight: 'bold', color: '#fff'}}>
                          {tapeData.lStatus}
                        </span>
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Box>
          <Box>
            <TapeContent/>
          </Box>
        </Box>
      </Box>

      {/* Right Side - Tape Details */}
      <Box sx={{ width: '50%', marginLeft: '2rem' }}>
        <Button
          variant="contained"

          onClick={handleAddNewTapeDetails} // Open the popup
          sx={{
            mt: '2rem',
            backgroundColor: colorPalette.yellow[500],
            color: colorPalette.black[900],
          }}

        >
          Add New Tape Detail 
        </Button>
        {/* Add New Tape Popup */}
        <AddNewTapePopup
          open={addNewTapePopupOpen}
          onClose={handleCloseAddNewTapePopup}
          tapeId={tapeData ? tapeData.tapeId : null}// Pass systemId if available
        />
      </Box>

    </Box>
  );
};

export default ViewTape;
