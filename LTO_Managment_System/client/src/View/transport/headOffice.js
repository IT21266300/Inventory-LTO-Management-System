import React, { useState } from "react";
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
  Chip,
} from "@mui/material";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import DeleteIcon from "@mui/icons-material/Delete";
import logo from "../../assets/logo.png";
import autoTable from "jspdf-autotable";
import SubSystem from "View/subsystems";

const HeadOffice = () => {
  const [locationStatus, setLocationStatus] = useState("");
  const [tapeIds, setTapeIds] = useState([]);
  const [sysName, setSysName] = useState("");
  const [subSysName, setSubSysName] = useState("");
  const [inputTapeId, setInputTapeId] = useState("");

  const currentDate = new Date();

  // Format the date as YYYY-MM-DD
  const formattedDate =
    currentDate.getFullYear() +
    "-" +
    ("0" + (currentDate.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + currentDate.getDate()).slice(-2);

  // Format the time as HH:MM
  const formattedTime =
    ("0" + currentDate.getHours()).slice(-2) +
    ":" +
    ("0" + currentDate.getMinutes()).slice(-2);

  // Combine date and time
  const formattedDateTime = formattedDate + " - " + formattedTime;

  const handleAddTapeId = () => {
    if (inputTapeId && !tapeIds.includes(inputTapeId)) {
      setTapeIds([...tapeIds, inputTapeId]);
      setInputTapeId("");
    } else {
      toast.error("Tape ID is either empty or already added.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const handleRemoveTapeId = (id) => {
    setTapeIds(tapeIds.filter((tapeId) => tapeId !== id));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put("/api/tape/updateTapeStatuses", {
        tapeIds,
        lStatus: locationStatus,
        sysName,
        subSysName
      });

      const resData = response.data.checkResult;
      resData.map((i) => {
        console.log(i.sysName);
      })

      // Download PDF after submission
      const doc = new jsPDF();
      doc.rect(5, 5, 200, 287, "S");

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text("Tape Status Update", 15, 20);
      doc.addImage(logo, "PNG", 170, 15, 20, 18);
      doc.text(`From: ${locationStatus}`, 15, 40);
      doc.text(`To: ${locationStatus}`, 170, 40);
      doc.text(`Date: ${formattedDateTime}`, 15, 50);
      autoTable(doc, {
        columns: [
          {
            header: "No.",
            dataKey: "no",
          },
          {
            header: "Tape ID",
            dataKey: "tapeid",
          },
          {
            header: "System",
            dataKey: "system",
          },
          {
            header: "Sub System",
            dataKey: "Sub System",
          },
        ],
        styles: { fontSize: 10 },
        body: resData.map((dataSet, index) => [
          index + 1, // First column: index
          dataSet.tapeId, // Second column: tapeId
          dataSet.sysName,
          dataSet.subSysName,
        ]),
        startY: 55,
        margin: { top: 10 },
      });

      doc.text(
        `Name of the IT Officer: ................................`,
        15,
        250
      );

      doc.text(`User ID: ................................`, 15, 265);

      doc.text(`Signature: ................................`, 15, 280);

      doc.save("TapeStatusUpdate.pdf");

      toast.success("Tape statuses updated successfully!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (err) {
      toast.error(err.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  return (
    <Box sx={{ padding: "2rem" }}>
      <Paper
        elevation={3}
        sx={{
          padding: "2rem",
          borderRadius: "10px",
          backgroundColor: "#333",
          color: "#fff",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Update Tape Status
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Location Status:
            </Typography>
            <Select
              value={locationStatus}
              onChange={(e) => setLocationStatus(e.target.value)}
              fullWidth
              sx={{
                backgroundColor: "#444",
                color: "#fff",
                border: "1px solid #ffe404",
              }}
            >

              <MenuItem value={'HO->DRN'}>DR Nugegoda</MenuItem>
              <MenuItem value={'HO->DRM'}>DR Maharagama</MenuItem>
              <MenuItem value={'HO->DRP'}>DR Pitipana</MenuItem>
              
              


              

            </Select>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="subtitle1" gutterBottom>
              Enter Tape IDs:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                value={inputTapeId}
                onChange={(e) => setInputTapeId(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddTapeId();
                    e.preventDefault();
                  }
                }}
                placeholder="Enter Tape ID and press Enter"
                fullWidth
                sx={{
                  backgroundColor: "#444",
                  color: "#fff",
                  input: { color: "#fff" },
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddTapeId}
                sx={{
                  marginLeft: "10px",
                  backgroundColor: "#ffe404",
                  color: "#333",
                }}
              >
                Add
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ marginTop: "1rem" }}>
          {tapeIds.map((tapeId, index) => (
            <Chip
              key={index}
              label={tapeId}
              onDelete={() => handleRemoveTapeId(tapeId)}
              deleteIcon={<DeleteIcon />}
              sx={{
                backgroundColor: "#555",
                color: "#fff",
                margin: "5px",
              }}
            />
          ))}
        </Box>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            marginTop: "2rem",
            backgroundColor: "#ffe404",
            color: "#333",
          }}
        >
          Submit and Download PDF
        </Button>
      </Paper>
    </Box>
  );
};

export default HeadOffice;
