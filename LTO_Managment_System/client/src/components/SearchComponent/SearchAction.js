import React, { useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Grid,
  Container,
  styled
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios'; // Import axios for API calls

// Note: No need for @mui/styles since you're using styled

const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: '2px', // Added margin to the container
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: 'white',
  borderRadius: '5px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
}));

const HeaderStyled = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: '5px',
}));

const SearchFormStyled = styled('form')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '5px',
}));

const SearchInputGroupStyled = styled(Grid)(({ theme }) => ({
  width: '200px',
  marginBottom: '5px',
}));

const FooterStyled = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginTop: '5px',
}));

function Search({ onSearch }) { // Pass onSearch prop for search action
  const [tapeId, setTapeId] = useState('');
  const [systemName, setSystemName] = useState('');
  const [applicationName, setApplicationName] = useState('');
  const [backupStatus, setBackupStatus] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [tapeStatus, setTapeStatus] = useState('');
  const [startDate, setStartDate] = useState(null); // Start Date state
  const [endDate, setEndDate] = useState(null); // End Date state
  const [location, setLocation] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const searchData = {
      tapeId,
      systemName,
      applicationName,
      backupStatus,
      mediaType,
      tapeStatus,
      startDate: startDate ? startDate.toISOString().slice(0, 10) : null,
      endDate: endDate ? endDate.toISOString().slice(0, 10) : null,
      location
    };

    try {
      const response = await axios.post('/api/tape/search', searchData);
      onSearch(response.data); // Call onSearch prop with search results
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  return (
    <ContainerStyled maxWidth="md">
      <HeaderStyled variant="h4">Find The Tape At your Own</HeaderStyled>
      <SearchFormStyled onSubmit={handleSubmit}>
        <Grid container spacing={2} justifyContent="center">
          {/* First Row */}
          <Grid item xs={15} sm={3} className={SearchInputGroupStyled}>
            <TextField
              label="Tape ID"
              value={tapeId}
              onChange={(e) => setTapeId(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={15} sm={3} className={SearchInputGroupStyled}>
            <TextField
              label="System Name"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              fullWidth
              // helperText="Ex: ICBS"
            />
          </Grid>
          <Grid item xs={15} sm={3} className={SearchInputGroupStyled}>
            <TextField
              select
              label="Application Name"
              value={applicationName}
              onChange={(e) => setApplicationName(e.target.value)}
              fullWidth
            >
              <MenuItem value="">Application Name</MenuItem>
              {/* Add your type options here */}
            </TextField>
          </Grid>

          {/* Second Row */}
          <Grid item xs={15} sm={3} className={SearchInputGroupStyled}>
          <TextField
              select
              label="Backup Status"
              value={backupStatus}
              onChange={(e) => setBackupStatus(e.target.value)}
              fullWidth
            >
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Not Taken">Not Taken</MenuItem>
              {/* Add your condition options here */}
            </TextField>
          </Grid>
          <Grid item xs={15} sm={3} className={SearchInputGroupStyled}>
            <TextField
              select
              label="Media Type"
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              fullWidth
            >
              <MenuItem value="LTO6">LTO6</MenuItem>
              {/* Add your price range options here */}
            </TextField>
          </Grid>

          {/* Third Row */}
          <Grid item xs={15} sm={3} className={SearchInputGroupStyled}>
            <TextField
              select
              label="Tape Status"
              value={tapeStatus}
              onChange={(e) => setTapeStatus(e.target.value)}
              fullWidth
            >
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Ongoing">Ongoing</MenuItem>
              {/* Add your city options here */}
            </TextField>
          </Grid>
          <Grid item xs={15} sm={3} className={SearchInputGroupStyled}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newStartDate) => setStartDate(newStartDate)}
            >
              <TextField /> 
            </DatePicker>
          </Grid>

          {/* Fourth Row */}
          <Grid item xs={15} sm={3} className={SearchInputGroupStyled}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newEndDate) => setEndDate(newEndDate)}
            >
              <TextField /> 
            </DatePicker>
          </Grid>
          <Grid item xs={15} sm={3} className={SearchInputGroupStyled}>
            <TextField
              select
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
            >
              <MenuItem value="Head Office">Head Office</MenuItem>
              <MenuItem value="DR Nugegoda">DR Nugegoda</MenuItem>
              <MenuItem value="DR Maharagama">DR Maharagama</MenuItem>
              <MenuItem value="HO to DRN">HO to DRN</MenuItem>
              <MenuItem value="HO to DRM">HO to DRM</MenuItem>
              <MenuItem value="DRN to DRM">DRN to DRM</MenuItem>
              <MenuItem value="DRM to DRN">DRM to DRN</MenuItem>
              <MenuItem value="DRN to HO">DRN to HO</MenuItem>
              <MenuItem value="DRM to HO">DRM to HO</MenuItem>
              {/* Add your city options here */}
            </TextField>
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
      </SearchFormStyled>
      <FooterStyled variant="body1">
        Welcome to BOC LTO Management System
      </FooterStyled>
    </ContainerStyled>
  );
}

export default Search;