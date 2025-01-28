import React from 'react';
import Header from "components/Header";
import axios from "axios";
import { Box, IconButton } from "@mui/material";
import StaffTables from "components/StaffComponents/StaffTables";
import { Helmet } from "react-helmet-async";
import { colorPalette } from "customTheme";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const Restoration = () => {

   const navigate = useNavigate();

  return (
   <Box m="1.5rem  2.5rem">
   <Helmet>
     <title>Admin Panel</title>
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
     <Header title="Restoration Management" subtitle="Manage Restoration functions" />
   </Box>
 </Box>
  )
}

export default Restoration