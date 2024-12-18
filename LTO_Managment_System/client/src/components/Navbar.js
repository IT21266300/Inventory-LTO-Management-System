import React, { useEffect, useRef } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import FlexBetween from './FlexBetween';
import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Toolbar,
} from '@mui/material';
import customTheme, { colorPalette } from 'customTheme';
import { useNavigate } from 'react-router-dom';
import StyledMenu from './StyledMenu';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import { Store } from './../store';
import { useContext } from 'react';

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  
  // Timer functionality
  const timerId = useRef(null);

  const resetTimer = () => {
    clearTimeout(timerId.current);
    timerId.current = setTimeout(() => {
      signoutHandler(); 
    }, 10 * 60 * 1000); // 10 minutes in milliseconds
  };

  useEffect(() => {
    // Start timer on component mount
    resetTimer();

    // Attach event listeners for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    // Clean up timer and event listeners on component unmount
    return () => {
      clearTimeout(timerId.current);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, []);

  const signoutHandler = () => {
    setAnchorEl(null);
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('staffId');
    navigate('/signin');
  };

  const loginProfile = () => {
    setAnchorEl(null);
    navigate('/profile')
  }

  return (
    <AppBar
      sx={{
        position: 'static',
        background: colorPalette.black1[500],
        width: '100%',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <FlexBetween>
          {userInfo && (
            <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <MenuIcon sx={{ color: 'white', fontSize: 35 }} />
            </IconButton>
          )}
          <Box sx={{
            [customTheme.breakpoints.down('sm')]: {
              display: 'none',
            },
            [customTheme.breakpoints.up('md')]: {
              display: 'block',
            },
          }}>
            <Button variant="text" sx={{ color: 'white' , fontSize: '1.5rem'}} onClick={() => navigate('/dashboard')}>
              BOC LTO Management System
            </Button>
          </Box>
        </FlexBetween>
        <FlexBetween gap="1.5rem">
          {userInfo && (
            <Box>
              <Button
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  backgroundColor: colorPalette.yellow[500],
                  color: colorPalette.primary[500],
                  '&:hover': {
                    backgroundColor: colorPalette.secondary[200],
                    color: colorPalette.primary[500],
                  },
                }}
              >
                {userInfo.name} 
                <Divider orientation="vertical" flexItem sx={{m: '0 0.6rem'}}/>
                {userInfo.staffId}
              </Button>
              <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={loginProfile} disableRipple>
                  <PersonIcon />
                  User Profile
                  <ArrowRightIcon />
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={signoutHandler} disableRipple>
                  <LogoutIcon />
                  Logout
                  <ArrowRightIcon />
                </MenuItem>
              </StyledMenu>
            </Box>
          )}
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;