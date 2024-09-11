import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    IconButton,
    Typography,
  } from "@mui/material";
  import UpdateTapeStatusComponent from "components/TransportComponent/UpdateTapeStatusComponent";
  import { colorPalette } from "customTheme";
  import React from "react";
  import { Helmet } from "react-helmet-async";
  import ArrowBackIcon from "@mui/icons-material/ArrowBack";
  import { useNavigate } from "react-router-dom";
  import Header from "components/Header";
  import main from "../../assets/main.jpeg";
  import nugegoda from "../../assets/nugegoda.jpeg";
  import maharagama from "../../assets/maharagama.jpeg";
  import pitipana from "../../assets/pitipana.jpg";
  
  export default function Transport() {
    const navigate = useNavigate();
  
    const functionInfo = [
      {
        id: 1,
        name: "Head Office",
        para: "",
        link: "/headofficeL",
        img: main,
      },
      {
        id: 2,
        name: "Nugegoda",
        para: "",
        link: "/nugegodaL",
        img: nugegoda,
      },
      {
        id: 3,
        name: "Maharagama",
        para: "",
        link: "/maharagamaL",
        img: maharagama,
      },
      {
        id: 4,
        name: "Pitipana",
        para: "",
        link: "/pitipanaL",
        img: pitipana,
      },
    ];
  
    return (
      <Box m="1.5rem  2.5rem">
        <Helmet>
          <title>Locker Management</title>
        </Helmet>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              backgroundColor: colorPalette.yellow[500],
              color: colorPalette.black[500],
              width: "40px",
              height: "40px",
              "&:hover": {
                backgroundColor: colorPalette.yellow[400],
                color: colorPalette.black[500],
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Header title="Locker Management" subtitle="Manage Lockers" />
        </Box>
  
        <Box>
          <Box sx={{ minWidth: "100%", paddingTop: "2rem" }}>
            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 3 }}
              columns={{ xs: 1, sm: 2, md: 10 }}
            >
              {functionInfo.map((func) => (
                <Grid
                  key="func.id"
                  item
                  xs={1}
                  md={3}
                  sx={{ minHeight: "200px" }}
                >
                  <Card
                    sx={{
                      width: "100%",
                      height: "100%",
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
                    <CardActions sx={{ margin: "auto", marginRight: 0 }}>
                      <Button
                        size="small"
                        sx={{
                          color: colorPalette.black[500],
                          background: colorPalette.yellow[500],
                          "&:hover": {
                            backgroundColor: colorPalette.yellow[400],
                            color: colorPalette.black[500],
                          },
                        }}
                        onClick={() => {
                          navigate(func.link);
                        }}
                        variant="contained"
                      //   endIcon={<ArrowForwardIcon />}
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
      </Box>
    );
  }
  