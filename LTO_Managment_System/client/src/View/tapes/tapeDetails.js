import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  TextField,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { LoadingAnimation } from "components/LoadingComponent/LoadingAnimationTwo";
import { toast } from "react-toastify";
import customTheme, { colorPalette } from "customTheme";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';


import AddNewTapePopup from '../../components/TapeComponent/TapeDetailsAdd'; // Assuming your popup component is called AddNewTapePopup
import TapeContent from 'components/TapeComponent/TapeContent';
import { Store } from 'store';
import textFieldStyles from 'styles/textFieldStyles';
import QRCodeComponent from '../../components/QRCodeComponent/QRCodeComponent'
import QRCodeGenerator from "../../components/QRCodeComponent/QRCodeGenerator";


const ViewTape = () => {
  const navigate = useNavigate();
  const { tapeId } = useParams();
  const [tapeData, setTapeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state } = useContext(Store);
  const { userInfo } = state;

  // State for updating status
  const [dayoftheweek, setDayoftheWeek] = useState(null);
  const [backupStatus, setBackupStatus] = useState(null);
  const [tapeStatus, setTapeStatus] = useState(null);
  const [locationStatus, setLocationStatus] = useState(null);
  const [specialStatus, setSpecialStatus] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // State for showing QR Code
  // const [showQRCode, setShowQRCode] = useState(false);

  // State for the Add New Tape Popup
  const [addNewTapePopupOpen, setAddNewTapePopupOpen] = useState(false);

  const [qrCodePopupOpen, setQRCodePopupOpen] = useState(false);

  const handleGenerateQRCode = () => {
    setQRCodePopupOpen(true);
  };

  const handleCloseQRCodePopup = () => {
    setQRCodePopupOpen(false);
  };

  useEffect(() => {
    const fetchTapeData = async () => {
      try {
        const response = await axios.get(`/api/tape/${tapeId}`);
        setTapeData(response.data[0]);
        console.log(response.data);

        // Initialize update states with current values
        setDayoftheWeek(response.data[0].dayoftheweek);
        setBackupStatus(response.data[0].bStatus);
        setTapeStatus(response.data[0].tStatus);
        setLocationStatus(response.data[0].lStatus);
        setSpecialStatus(response.data[0].sStatus);
        setStartDate(response.data[0].sDate);
        setEndDate(response.data[0].eDate);

      } catch (err) {
        setError(err.message);
        toast.error(err.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTapeData();
  }, [tapeId]);

  if (loading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        Error: {error}
      </Typography>
    );
  }

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const handleUpdateStatus = async () => {
    try {
      const response = await axios.put(`/api/tape/updateTapeStatus/${tapeId}`, {
        dayoftheweek: dayoftheweek,
        bStatus: backupStatus,
        tStatus: tapeStatus,
        lStatus: locationStatus,
        sStatus: specialStatus,
        lastUpdate:localStorage.getItem('staffId')
      });

      // Assuming your API returns the updated data
      setTapeData(response.data);

      toast.success("Status updated successfully!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      window.location.reload();
    } catch (err) {
      toast.error(err.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.error(err);
    }
  };

  const handleUpdateDateStatus = async () => {
    try {
      const response = await axios.put(`/api/tape/updateDateStatus/${tapeId}`, {
        sDate: startDate,
        eDate: endDate,
        lastUpdate:localStorage.getItem('staffId')
      });

      // Assuming your API returns the updated data
      setTapeData(response.data);

      toast.success("Date Status updated successfully!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      window.location.reload();
    } catch (err) {
      toast.error(err.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.error(err);
    }
  };

  const handleAddNewTapeDetails = () => {
    setAddNewTapePopupOpen(true);
  };

  const handleCloseAddNewTapePopup = () => {
    setAddNewTapePopupOpen(false);
  };

  return (
    <Box
      sx={{
        padding: "2rem",
      }}
    >
      <Box sx={{ marginBottom: "1rem" }}>
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
         {/* Add QR Code Generation Section */}
       {/* Add the button to trigger the QR Code popup */}
       <Button
        variant="contained"
        onClick={handleGenerateQRCode}
        sx={{
          mt: "2rem",
          backgroundColor: colorPalette.yellow[500],
          color: colorPalette.black[900],
        }}
      >
        Get QR Code
      </Button>

      {/* QR Code Popup */}
      <QRCodeGenerator
        open={qrCodePopupOpen}
        onClose={handleCloseQRCodePopup}
        data={tapeData ? tapeData.tapeId : ""} // Pass the tapeId to the QR Code component
      />
      </Box>
      {/* top component */}
      <Box>
        {/* Your other component goes here */}
        <Paper
          elevation={3}
          sx={{
            padding: "2rem",
            marginBottom: "2rem",
            borderRadius: "10px",
            backgroundColor: colorPalette.black1[500],
            color: "#fff",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Update Tape Status
          </Typography>

          <Grid
            container
            spacing={4}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Grid item xs={12} md={2}>
              <Typography variant="subtitle1" gutterBottom>
                Day of the Week:
              </Typography>
              <Select
                value={dayoftheweek}
                onChange={(e) => setDayoftheWeek(e.target.value)}
                fullWidth
                sx={{
                  backgroundColor: colorPalette.black1[400],
                  color: "#fff",
                  border: "1px solid #ffe404",
                }}
              >
                  <MenuItem value="Sunday">Sunday</MenuItem>
                  <MenuItem value="Monday">Monday</MenuItem>
                  <MenuItem value="Tuesday">Tuesday</MenuItem>
                  <MenuItem value="Webnesday">Webnesday</MenuItem>
                  <MenuItem value="Thursday">Thursday</MenuItem>
                  <MenuItem value="Friday">Friday</MenuItem>
                  <MenuItem value="Saturday">Saturday</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography variant="subtitle1" gutterBottom>
                Backup Status:
              </Typography>
              <Select
                value={backupStatus}
                onChange={(e) => setBackupStatus(e.target.value)}
                fullWidth
                sx={{
                  backgroundColor: colorPalette.black1[400],
                  color: "#fff",
                  border: "1px solid #ffe404",
                }}
              >
                <MenuItem value={"Completed"}>Completed</MenuItem>
                <MenuItem value={"Failed"}>Failed</MenuItem>
                <MenuItem value={"In Progress"}>In Progress</MenuItem>
                <MenuItem value={"Not Taken"}>Not Taken</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography variant="subtitle1" gutterBottom>
                Tape Status:
              </Typography>
              <Select
                value={tapeStatus}
                onChange={(e) => setTapeStatus(e.target.value)}
                fullWidth
                sx={{
                  backgroundColor: colorPalette.black1[400],
                  color: "#fff",
                  border: "1px solid #ffe404",
                }}
              >
                <MenuItem value="Full">Full</MenuItem>
                <MenuItem value="In Use">In Use</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography variant="subtitle1" gutterBottom>
                Location Status:
              </Typography>
              <Select
                value={locationStatus}
                onChange={(e) => setLocationStatus(e.target.value)}
                fullWidth
                sx={{
                  backgroundColor: colorPalette.black1[400],
                  color: "#fff",
                  border: "1px solid #ffe404",
                }}
              >
                <MenuItem value={"HO"}>Head Office</MenuItem>
                <MenuItem value={"DRN"}>DR Nugegoda</MenuItem>
                <MenuItem value={"DRM"}>DR Maharagama</MenuItem>
                <MenuItem value={"HO->DRN"}>HO to DRN</MenuItem>
                <MenuItem value={"DRN->DRM"}>DRN to DRM</MenuItem>
                <MenuItem value={"DRM->DRN"}>DRM to DRN</MenuItem>
                <MenuItem value={"DRN->HO"}>DRN to HO</MenuItem>
                <MenuItem value={"DRM->HO"}>DRM to HO</MenuItem>
                <MenuItem value={"HO->DRM"}>HO to DRM</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography variant="subtitle1" gutterBottom>
                Special Status:
              </Typography>
              <Select
                value={specialStatus}
                onChange={(e) => setSpecialStatus(e.target.value)}
                fullWidth
                sx={{
                  backgroundColor: colorPalette.black1[400],
                  color: "#fff",
                  border: "1px solid #ffe404",
                }}
              >
                <MenuItem value={"Permanent"}>Permanent</MenuItem>
                <MenuItem value={"Entire System"}>Entire System</MenuItem>
                <MenuItem value={"Weekly"}>Weekly</MenuItem>
                <MenuItem value={"Monthly"}>Monthly</MenuItem>
              </Select>
            </Grid>


            <Grid
              item
              xs={12}
              md={2}
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                onClick={handleUpdateStatus}
                sx={{
                  backgroundColor: colorPalette.yellow[500],
                  color: colorPalette.black[900],
                  marginTop: "1.5rem",
                  width: '200px'
                }}
              >
                Update Tape Status
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* title component */}
      <Box
        sx={{
          width: "100%",
          height: "12vh",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ color: "#fff" }}>
          Tape Details
        </Typography>
        {userInfo.position === "Admin" && (
          <Button
            variant="contained"
            onClick={handleAddNewTapeDetails} // Open the popup
            sx={{
              mt: "2rem",
              backgroundColor: colorPalette.yellow[500],
              color: colorPalette.black[900],
            }}
          >
            Add New Tape Detail
          </Button>
        )}
        <AddNewTapePopup
          open={addNewTapePopupOpen}
          onClose={handleCloseAddNewTapePopup}
          tapeId={tapeData ? tapeData.tapeId : null} // Pass systemId if available
        />
      </Box>

      {/* bottom component */}
      <Box>
      {tapeData && tapeData.isReUse === 1 && (
          <Paper
            elevation={3}
            sx={{
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "10px",
              backgroundColor: "red", // Red background color
              color: "white", // White text color
              textAlign: "center", // Center text
            }}
          >
            <Typography variant="h6">This tape is marked for re-use.</Typography>
          </Paper>
        )}

    
        <Box
          sx={{
            width: "100%",
            display: "flex",
            gap: "2rem",
            flexDirection: "row",
            [customTheme.breakpoints.down("md")]: {
              justifyContent: "space-between",
              flexDirection: "column",
            },
          }}
        >
          
          <Box sx={{ width: "100%" }}>
            {tapeData && (
              <Paper
                elevation={3}
                sx={{
                  padding: "2rem",
                  marginBottom: "2rem",
                  borderRadius: "10px",
                  backgroundColor: colorPalette.black1[500],
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: "1rem",
                        backgroundColor: "transparent",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid #ffe404",
                      }}
                    >
                      <Typography
                        style={{
                          color: colorPalette.yellow[200],
                          width: "170px",
                        }}
                      >
                        Tape ID :{" "}
                      </Typography>
                      <Typography style={{ fontSize: "1.5rem", color: "#fff" }}>
                        {tapeData.tapeId}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: "1rem",
                        backgroundColor: "transparent",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid #ffe404",
                      }}
                    >
                      <Typography
                        style={{
                          color: colorPalette.yellow[200],
                          width: "170px",
                        }}
                      >
                        System Name:
                      </Typography>
                      <Typography style={{ fontSize: "1.5rem", color: "#fff" }}>
                        {tapeData.sysName}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: "1rem",
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid #ffe404",
                      }}
                    >
                      <Typography
                        style={{
                          color: colorPalette.yellow[200],
                          width: "170px",
                        }}
                      >
                        Application Name:
                      </Typography>
                      <Typography style={{ fontSize: "1.5rem", color: "#fff" }}>
                        {tapeData.subSysName}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: "1rem",
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid #ffe404",
                      }}
                    >
                      <Typography
                        style={{
                          color: colorPalette.yellow[200],
                          width: "170px",
                        }}
                      >
                        Day of the Week:
                      </Typography>
                      <Typography style={{ fontSize: "1.5rem", color: "#fff" }}>
                        {tapeData.dayoftheweek}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: "1rem",
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid #ffe404",
                      }}
                    >
                      <Typography
                        style={{
                          color: colorPalette.yellow[200],
                          width: "170px",
                        }}
                      >
                        Backup Status:
                      </Typography>
                      <Typography style={{ fontSize: "1.5rem", color: "#fff" }}>
                        {tapeData.bStatus}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: "1rem",
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid #ffe404",
                      }}
                    >
                      <Typography
                        style={{
                          color: colorPalette.yellow[200],
                          width: "170px",
                        }}
                      >
                        Media Type:
                      </Typography>
                      <Typography style={{ fontSize: "1.5rem", color: "#fff" }}>
                        {tapeData.mType}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: "1rem",
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid #ffe404",
                      }}
                    >
                      <Typography
                        style={{
                          color: colorPalette.yellow[200],
                          width: "170px",
                        }}
                      >
                        Tape Status:
                      </Typography>
                      <Typography style={{ fontSize: "1.5rem", color: "#fff" }}>
                        {tapeData.tStatus}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: "1rem",
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid #ffe404",
                      }}
                    >
                      <Typography
                        style={{
                          color: colorPalette.yellow[200],
                          width: "170px",
                        }}
                      >
                        Start Date:
                      </Typography>
                      <Typography style={{ fontSize: "1.5rem", color: "#fff" }}>
                        {formatDate(tapeData.sDate)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: "1rem",
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid #ffe404",
                      }}
                    >
                      <Typography
                        style={{
                          color: colorPalette.yellow[200],
                          width: "170px",
                        }}
                      >
                        End Date:
                      </Typography>
                      <Typography style={{ fontSize: "1.5rem", color: "#fff" }}>
                        {formatDate(tapeData.eDate)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: "1rem",
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid #ffe404",
                      }}
                    >
                      <Typography
                        style={{
                          color: colorPalette.yellow[200],
                          width: "170px",
                        }}
                      >
                        Location Status :
                      </Typography>
                      <Typography style={{ fontSize: "1.5rem", color: "#fff" }}>
                        {tapeData.lStatus}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: "1rem",
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid #ffe404",
                      }}
                    >
                      <Typography
                        style={{
                          color: colorPalette.yellow[200],
                          width: "170px",
                        }}
                      >
                        Special Status :
                      </Typography>
                      <Typography style={{ fontSize: "1.5rem", color: "#fff" }}>
                        {tapeData.sStatus}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Box>
          <Box sx={{ width: "100%" }}>
            <TapeContent tapeId={tapeData.tapeId} tapeDate={tapeData.eDate} />
          </Box>
        </Box>
      </Box>

      {/* title component */}
      <Box
        sx={{
          width: "100%",
          height: "12vh",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
      </Box>

      {/* date update component */}
      <Box>
        {/* Your other component goes here */}
        <Paper
          elevation={3}
          sx={{
            padding: "2rem",
            marginBottom: "2rem",
            borderRadius: "10px",
            backgroundColor: colorPalette.black1[500],
            color: "#fff",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Update Date Status
          </Typography>

          <Grid
            container
            spacing={4}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Grid item xs={12} md={4}>
              <TextField
                name="sDate"
                label="Start Date" // Updated label
                variant="outlined"
                type="date" // Changed to datetime-local
                InputLabelProps={{
                  shrink: true,
                }}
                sx={textFieldStyles}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              // aria-readonly
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                name="eDate"
                label="End Date" // Updated label
                variant="outlined"
                type="date" // Changed to datetime-local
                InputLabelProps={{
                  shrink: true,
                }}
                sx={textFieldStyles}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              // aria-readonly
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={2}
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                onClick={handleUpdateDateStatus}
                sx={{
                  backgroundColor: colorPalette.yellow[500],
                  color: colorPalette.black[900],
                  marginTop: "1.5rem",
                  width: '200px'
                }}
              >
                Update Date Status
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default ViewTape;
