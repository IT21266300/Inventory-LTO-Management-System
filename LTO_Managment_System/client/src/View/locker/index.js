import { Box, IconButton } from '@mui/material'
import React from 'react'
import { Helmet } from 'react-helmet-async'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { colorPalette } from 'customTheme';
import Header from 'components/Header';


export default function Locker() {
  const navigate = useNavigate();
  return (
    <Box m="1.5rem  2.5rem">
      <Helmet>
        <title>Staff Management</title>
      </Helmet>
      <Box sx={{ width: '100%', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: colorPalette.yellow[500],
            color: colorPalette.black[500],
            width: '40px',
            height: '40px',
            '&:hover': {
              backgroundColor: colorPalette.yellow[400],
              color: colorPalette.black[500],
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Header title="Lockers Management" subtitle="Manage Data Center Lockers" />
      </Box>
    </Box>
  )
}
