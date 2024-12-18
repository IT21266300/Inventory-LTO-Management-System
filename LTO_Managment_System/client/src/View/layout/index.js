import React, { useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { colorPalette } from 'customTheme';

const Layout = () => {
  const isDesktop = useMediaQuery('(min-width: 600px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <Box minWidth="100%" minHeight="100%" display={isDesktop ? 'flex' : 'block'} sx={{background: colorPalette.black[500]}}>
      <Sidebar
        isDesktop={isDesktop}
        drawerWidth="320px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box width="100%">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
