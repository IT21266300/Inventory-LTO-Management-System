import React, { useState } from 'react';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';

import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
} from '@mui/icons-material';

import CellTowerIcon from '@mui/icons-material/CellTower';
import TimelineIcon from '@mui/icons-material/Timeline';
import CloseIcon from '@mui/icons-material/Close';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import EngineeringIcon from '@mui/icons-material/Engineering';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import FolderIcon from '@mui/icons-material/Folder';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import Logo from './../assets/logo.svg';
import Logo1 from './../assets/enLogo.png';
import SdCardIcon from '@mui/icons-material/SdCard';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SensorWindowIcon from '@mui/icons-material/SensorWindow';
import Inventory2Icon from '@mui/icons-material/Inventory2';

import LineAxisIcon from '@mui/icons-material/LineAxis';

import { useEffect, useSate } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FlexBetween from './FlexBetween';
import { colorPalette } from 'customTheme';
import Dashboard from 'View/dashboard';

import { Store } from './../store';
import { useContext } from 'react';

const navItems = [
  {
    text: 'Dashboard',
    op: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    text: 'tape',
    op: 'LTO Management',
    icon: <SdCardIcon />,
  },
  {
    text: 'Locker Management',
    op: 'Locker Management',
    icon: <WorkHistoryIcon />,
  },
  {
    text: 'LTO Transport',
    op: 'LTO Transport',
    icon: <LocalShippingIcon />,
  },
  {
    text: 'Staff',
    op: 'Staff Management',
    icon: <Diversity3Icon />,
  },
  {
    text: 'Systems',
    op: 'Systems Management',
    icon: <SensorWindowIcon />,
  },
  {
    text: 'Inventory',
    op: 'Inventory Management',
    icon: <Inventory2Icon />,
  },
  {
    text: 'Admin',
    op: 'Admin Panel',
    icon: <LineAxisIcon />,
  },
  {
    text: 'Log',
    op: 'Log Management',
    icon: <BookIcon />,
  },
  {
    text: 'Documentation',
    op: 'Documentation',
    icon: <FolderIcon />,
  },
];

const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isDesktop,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState('');
  const navigate = useNavigate();
  //   const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const { state } = useContext(Store);
  const { userInfo } = state;

  return (
    userInfo && (
      <Box component="nav">
        {isSidebarOpen && (
          <Drawer
            open={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            // variant="persistent"
            anchor="left"
            sx={{
              width: drawerWidth,
              '& .MuiDrawer-paper': {
                color: colorPalette.secondary[100],
                backgroundColor: colorPalette.black1[500],
                boxSizing: 'border-box',
                borderWidth: isDesktop ? 0 : '2px',
                width: drawerWidth,
              },
            }}
          >
            <Box width="100%">
              <Box sx={{margin: '1rem 1rem 0 1rem'}}>
                <FlexBetween color={colorPalette.secondary[500]}>
                  <Box>
                    <img src={Logo} width="150px" height="70px" />
                  </Box>
                  {isDesktop && (
                    <IconButton
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      sx={{ color: colorPalette.yellow[500] }}
                    >
                      <ArrowBackIosIcon />
                    </IconButton>
                  )}
                </FlexBetween>
              </Box>
              <List>
                {navItems.map(({ text, icon, op }) => {
                  const simText = text.toLowerCase();
                  return (
                    <ListItem
                      key={text}
                      disablePadding
                      sx={{
                        backgroundColor:
                          active === simText
                            ? colorPalette.yellow[500]
                            : 'transparent',
                        color:
                          active === simText
                            ? colorPalette.primary[900]
                            : colorPalette.yellow[500],
                        '&:hover': {
                          backgroundColor: colorPalette.yellow[500],
                          color: colorPalette.black[500],
                        },
                        '&:hover .list-item-icon': {
                          color: 'black', // Apply hover effect to the icon
                        },
                      }}
                    >
                      <ListItemButton
                        onClick={() => {
                          navigate(`/${simText}`);
                          setActive(simText);
                          setIsSidebarOpen(false);
                        }}
                      >
                        <ListItemIcon
                          className="list-item-icon"
                          sx={(theme) => ({
                            ml: '1rem',
                            color:
                              active === simText
                                ? colorPalette.primary[900]
                                : colorPalette.yellow[500],
                          })}
                        >
                          {icon}
                        </ListItemIcon>
                        <ListItemText primary={op} />
                        {active === simText && (
                          <KeyboardArrowRightIcon
                            sx={{
                              ml: 'auto',
                              color: colorPalette.primary[900],
                            }}
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Drawer>
        )}
      </Box>
    )
  );
};

export default Sidebar;
