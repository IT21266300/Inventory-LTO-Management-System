import {
  Box,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { colorPalette } from 'customTheme';
import React from 'react';
import { useContext } from 'react';
import { Store } from 'store';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  // const base64String = btoa(String.fromCharCode(...new Uint8Array(userInfo.profileImage.data.data)))

  const handleUpdate = () => {
    navigate('/updateStaff', { state: { data: userInfo } });
  };

  return (
    <Box p="3rem 0">
      <Box
        width="100%"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyItems: 'center',
          alignItems: 'center',
          mb: '1.5rem',
        }}
      >
        <IconButton
          variant="solid"
          sx={{
            width: '40px',
            height: '40px',
            borderRadius: '100px',
            backgroundColor: colorPalette.yellow[500],
            color: colorPalette.black[500],
            '&:hover': {
              backgroundColor: colorPalette.yellow[500],
              color: colorPalette.black[500],
            },
          }}
        >
          <PersonIcon />
        </IconButton>

        <Typography
          variant="h5"
          textAlign="center"
          sx={{ color: '#fff', mt: '1rem' }}
        >
          User Profile
        </Typography>
      </Box>
      <form>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TextField
            id="outlined-basic"
            label="Staff ID"
            variant="outlined"
            value={userInfo.staffId}
            sx={{
              mb: '1.5rem',

              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffe404',
                },
              },
              '& .MuiInputLabel-outlined': {
                color: '#fff',
              },
              // "&.Mui-focused": {
              //   "& .MuiOutlinedInput-notchedOutline": {
              //     borderColor: "#ffe404",
              //     borderWidth: "3px",
              //   },
              // },
            }}
          />
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            value={userInfo.name}
            sx={{
              mb: '1.5rem',

              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffe404',
                },
              },
              '& .MuiInputLabel-outlined': {
                color: '#fff',
              },
              // "&.Mui-focused": {
              //   "& .MuiOutlinedInput-notchedOutline": {
              //     borderColor: "#ffe404",
              //     borderWidth: "3px",
              //   },
              // },
            }}
          />
          <TextField
            id="outlined-basic"
            label="Phone Number"
            variant="outlined"
            value={userInfo.phone}
            sx={{
              mb: '1.5rem',

              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffe404',
                },
              },
              '& .MuiInputLabel-outlined': {
                color: '#fff',
              },
              // "&.Mui-focused": {
              //   "& .MuiOutlinedInput-notchedOutline": {
              //     borderColor: "#ffe404",
              //     borderWidth: "3px",
              //   },
              // },
            }}
          />
          <TextField
            id="outlined-basic"
            label="Position"
            variant="outlined"
            value={userInfo.position}
            sx={{
              mb: '1.5rem',

              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffe404',
                },
              },
              '& .MuiInputLabel-outlined': {
                color: '#fff',
              },
              // "&.Mui-focused": {
              //   "& .MuiOutlinedInput-notchedOutline": {
              //     borderColor: "#ffe404",
              //     borderWidth: "3px",
              //   },
              // },
            }}
          />
        </Box>
      </form>
    </Box>
  );
};

export default Profile;
