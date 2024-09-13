import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { dateToJulianDays, julianDaysToDate } from 'gdate-julian'; // Importing from the package

const JulianDateConverter = () => {
  const [julianDate, setJulianDate] = useState('');
  const [gregorianDate, setGregorianDate] = useState('');

  const convertToGregorian = () => {
    try {
      const julianDays = parseFloat(julianDate);
      const gregorian = julianDaysToDate(julianDays); // Convert Julian Days to Gregorian Date
      setGregorianDate(gregorian.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    } catch (error) {
      console.error("Invalid Julian Days:", error);
    }
  };

  const convertToJulian = () => {
    try {
      const date = new Date(gregorianDate);
      const julianDays = dateToJulianDays(date); // Convert Gregorian Date to Julian Days
      setJulianDate(julianDays.toString());
    } catch (error) {
      console.error("Invalid Gregorian Date:", error);
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
      <Typography variant="h6" gutterBottom>
        Julian Date Converter
      </Typography>

      <TextField
        label="Julian Days"
        variant="outlined"
        value={julianDate}
        onChange={(e) => setJulianDate(e.target.value)}
        sx={{ mb: 2, width: '100%' }}
      />
      <Button variant="contained" onClick={convertToGregorian} sx={{ mb: 2 }}>
        Convert to Gregorian
      </Button>

      <TextField
        label="Gregorian Date (YYYY-MM-DD)"
        variant="outlined"
        value={gregorianDate}
        onChange={(e) => setGregorianDate(e.target.value)}
        sx={{ mb: 2, width: '100%' }}
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button variant="contained" onClick={convertToJulian}>
        Convert to Julian
      </Button>
    </Box>
  );
};

export default JulianDateConverter;
