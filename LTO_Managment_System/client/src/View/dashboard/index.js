import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import { colorPalette } from 'customTheme';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { Store } from '../../store';
import { useContext } from 'react';

import i1 from '../../assets/1.jpg';
import i2 from '../../assets/2.png';
import i3 from '../../assets/3.jpg';
import i4 from '../../assets/4.jpeg';
import i5 from '../../assets/5.jpg';
import i6 from '../../assets/image.jpeg';
import i9 from '../../assets/9.webp';
import i10 from '../../assets/10.jpg';
import { Helmet } from 'react-helmet-async';


const Dashboard = () => {
  const navigate = useNavigate();

  const { state } = useContext(Store);
  const { userInfo, loading } = state;

  const [position, setPosition] = useState(false);

  useEffect(() => {
    switch (userInfo.position) {
      case 'Super super':
        setPosition(true);
        break;
      case 'Admin':
        setPosition(true);
        break;
      case 'Operator':
        setPosition(true);
        break;
      case 'Read only':
        setPosition(true);
        break;
     
      default:
        setPosition(false);
    }
  }, [userInfo, position]);

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    }
  }, [userInfo, navigate]);

  const functionInfo = [
    {
      id: 1,
      name: 'LTO Management',
      para: 'From This function mange LTO details.',
      link: '/tape',
      img: i1,
    },
    position === true && {
      id: 2,
      name: 'Locker Management',
      para: 'From This function mange LTO Storage.',
      link: '/locker',
      img: i2,
    },
    {
      id: 3,
      name: 'LTO Transport',
      para: 'From This function mange location changes of the LTO.',
      link: '/transport',
      img: i3,
    },
    {
      id: 4,
      name: 'Staff Management',
      para: 'From This function mange finance status in each site.',
      link: '/staff',
      img: i4,
    },
    {
      id: 5,
      name: 'System Management',
      para: 'From This function mange finance status in each site.',
      link: '/systems',
      img: i5,
    },
    {
      id: 6,
      name: 'Inventory Management',
      para: 'From This function manage the inventory of tape.',
      link: '/inventory',
      img: i9,
    },
    {
      id: 7,
      name: 'Admin Panel',
      para: 'From This function manage LTO system.',
      link: '/admin',
      img: i10,
    },
    {
      id: 8,
      name: 'Log Management',
      para: 'From This function manage the user status in each user.',
      link: '/log',
      img: i6,
    },
  ];

  return loading ? (
    <div>Loading...</div>
  ) : (
    <Box m="1.5rem 2.5rem">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Box sx={{ minWidth: '100%', paddingTop: '2rem' }}>
        <Grid
          container
          rowSpacing={3}
          columnSpacing={{ xs: 3 }}
          columns={{ xs: 1, sm: 2, md: 12 }}
        >
          {functionInfo.map((func) => (
            <Grid key="func.id" item xs={1} md={3} sx={{ minHeight: '200px' }}>
              <Card
                sx={{
                  width: '100%',
                  height: '100%',
                  background: colorPalette.black1[500],
                }}
              >
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="140"
                  image={func.img}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ color: colorPalette.black1[100] }}
                  >
                    {func.name}
                  </Typography>
                </CardContent>
                <CardActions sx={{ margin: 'auto', marginRight: 0 }}>
                  <Button
                    size="small"
                    sx={{
                      color: colorPalette.black[500],
                      background: colorPalette.yellow[500],
                      '&:hover': {
                        backgroundColor: colorPalette.yellow[400],
                        color: colorPalette.black[500],
                      },
                    }}
                    onClick={() => {
                      navigate(func.link);
                    }}
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                  >
                    View More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
