import React, { useState } from "react";
import { 
  Box, Button, IconButton, TextField, Typography, FormControl, 
  InputLabel, Select, MenuItem, Grid 
} from "@mui/material";
import { colorPalette } from "customTheme";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import textFieldStyles from "styles/textFieldStyles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const RestorationDetailsForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    date: "",
    requesterName: "",
    department: "",
    contactNo: "",
    object: "",
    library: "",
    tapeDate: "",
    tapeType: "",
    destinationSystem: "",
    destinationLibrary: "",
    aspBefore: "",
    aspAfter: "",
    remarks: "",
    objectRenamedAs: "",
    daysRetained: "",
    restoredBy: "",
    restoredSignature: "",
    removalDate: "",
    removedBySignature: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/restoration/addRestoration", {
        ...formData,
        lastUpdate: localStorage.getItem("staffId"),
      });

      toast.success("Restoration details added successfully!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });

      navigate("/restoration");
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error(err.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  return (
    <Box
      width="100%"
      minHeight="20vh"
      p="3rem 0"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Box sx={{ width: 600, p: 3, bgcolor: "black", borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <IconButton
            sx={{
              width: "40px",
              height: "40px",
              borderRadius: "100px",
              backgroundColor: colorPalette.yellow[500],
              color: colorPalette.black[500],
              "&:hover": { backgroundColor: colorPalette.yellow[500] },
            }}
          >
            <AccountCircleIcon />
          </IconButton>
          <Typography variant="h5" sx={{ mt: "1rem", color: "yellow" }}>
            Add Restoration Details
          </Typography>
        </Box>

        <form onSubmit={submitHandler}>
          <Grid container spacing={2}>
            {/* Left Side */}
            <Grid item xs={6}>
              <TextField label="Date" type="date" name="date" InputLabelProps={{ shrink: true }} sx={textFieldStyles} onChange={handleChange} required fullWidth />
              <TextField label="Requester Name" name="requesterName" sx={textFieldStyles} onChange={handleChange} required fullWidth />
              <TextField label="Department" name="department" sx={textFieldStyles} onChange={handleChange} required fullWidth />
              <TextField label="Contact No" type="number" name="contactNo" sx={textFieldStyles} onChange={handleChange} required fullWidth />
              <TextField label="Object" name="object" sx={textFieldStyles} onChange={handleChange} required fullWidth />
              <TextField label="Library" name="library" sx={textFieldStyles} onChange={handleChange} required fullWidth />
              <TextField label="Tape Date" type="date" name="tapeDate" InputLabelProps={{ shrink: true }} sx={textFieldStyles} onChange={handleChange} required fullWidth />
              <TextField label="BE or AF" name="tapeType" sx={textFieldStyles} onChange={handleChange} required fullWidth />
            </Grid>

            {/* Right Side */}
            <Grid item xs={6}>
              <FormControl sx={textFieldStyles} fullWidth>
                <InputLabel>System</InputLabel>
                <Select name="destinationSystem" value={formData.destinationSystem} onChange={handleChange} required>
                  <MenuItem value="Backup">Backup</MenuItem>
                  <MenuItem value="Oracle">Oracle</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Library" name="destinationLibrary" sx={textFieldStyles} onChange={handleChange} required fullWidth />
              <TextField label="ASP Before" type="number" name="aspBefore" sx={textFieldStyles} onChange={handleChange} required fullWidth />
              <TextField label="ASP After" type="number" name="aspAfter" sx={textFieldStyles} onChange={handleChange} required fullWidth />
              <TextField label="Remarks" name="remarks" multiline rows={2} sx={textFieldStyles} onChange={handleChange} fullWidth />
              <TextField label="Object Renamed As" name="objectRenamedAs" sx={textFieldStyles} onChange={handleChange} fullWidth />
              <TextField label="Days Retained" type="number" name="daysRetained" sx={textFieldStyles} onChange={handleChange} required fullWidth />
            </Grid>
          </Grid>

          {/* Additional Fields - Full Width */}
          <TextField label="Restored By (Name & Signature)" name="restoredBy" sx={textFieldStyles} onChange={handleChange} required fullWidth />
          <TextField label="Restored By Signature" name="restoredSignature" sx={textFieldStyles} onChange={handleChange} required fullWidth />
          <TextField label="Date Removed" type="date" name="removalDate" InputLabelProps={{ shrink: true }} sx={textFieldStyles} onChange={handleChange} required fullWidth />
          <TextField label="Removed By Signature" name="removedBySignature" sx={textFieldStyles} onChange={handleChange} required fullWidth />

          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button onClick={() => navigate("/restoration")} sx={{ width: "45%", color: colorPalette.secondary[100], borderColor: "#fff" }} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" sx={{ width: "45%", backgroundColor: colorPalette.yellow[500], color: colorPalette.black2[500], "&:hover": { backgroundColor: colorPalette.yellow[400] } }}>
              Submit
            </Button>
          </Box>

        </form>
      </Box>
    </Box>
  );
};

export default RestorationDetailsForm;
