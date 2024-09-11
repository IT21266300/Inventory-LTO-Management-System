import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import textFieldStyles from "styles/textFieldStyles";

const JulianDateConverter = () => {
  const [julianDate, setJulianDate] = useState('');
  const [gregorianDate, setGregorianDate] = useState('');

  const convertToGregorian = () => {
    const jd = parseInt(julianDate, 10);
    const JDOffset = 2440587.5; // Julian date for UNIX epoch (1970-01-01)
    const unixTime = (jd - JDOffset) * 86400 * 1000;
    const date = new Date(unixTime);
    setGregorianDate(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
  };

  const convertToJulian = () => {
    const date = new Date(gregorianDate);
    const JDOffset = 2440587.5; // Julian date for UNIX epoch (1970-01-01)
    const julian = Math.floor((date.getTime() / 86400 / 1000) + JDOffset);
    setJulianDate(julian.toString());
  };

  return (
    <Box sx={{ p: 2,color: "#fff", border: '1px solid #ccc', borderRadius: '4px' }}>
      <Typography variant="h6" gutterBottom>
        Julian Date Converter
      </Typography>
      
      <TextField
        label="Julian Date"
        variant="outlined"
        value={julianDate}
        onChange={(e) => setJulianDate(e.target.value)}
        sx={textFieldStyles}
      />
      <Button variant="contained" onClick={convertToGregorian} sx={{ mb: 2 }}>
        Convert to Gregorian
      </Button>
      <TextField
        label="Gregorian Date (YYYY-MM-DD)"
        variant="outlined"
        value={gregorianDate}
        onChange={(e) => setGregorianDate(e.target.value)}
        sx={textFieldStyles}
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
