import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Grid,
  Container,
  styled,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { colorPalette } from "customTheme";
import textFieldStyles from "styles/textFieldStyles";

const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: "2px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  backgroundColor: "white",
  borderRadius: "5px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
}));

const HeaderStyled = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginBottom: "5px",
}));

const SearchFormStyled = styled("form")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "5px",
}));

const SearchInputGroupStyled = styled(Grid)(({ theme }) => ({
  width: "200px",
  marginBottom: "5px",
}));

const FooterStyled = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginTop: "5px",
}));

function Search({ onSearch }) {
  const [tapeId, setTapeId] = useState("");
  const [systemName, setSystemName] = useState("");
  const [applicationName, setApplicationName] = useState("");
  const [backupStatus, setBackupStatus] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [tapeStatus, setTapeStatus] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [location, setLocation] = useState("");
  const [systemData, setSystemData] = useState([]);
  const [parentSystem, setParentSystem] = useState({
    sysName: "",
    sysId: "",
  });
  const [subSystems, setSubSystems] = useState([]);
  const [subSysName, setSubSysName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const searchData = {
      tapeId,
      systemName,
      applicationName,
      backupStatus,
      mediaType,
      tapeStatus,
      startDate: startDate ? startDate.toISOString().slice(0, 10) : null,
      endDate: endDate ? endDate.toISOString().slice(0, 10) : null,
      location,
      subSysName,
    };

    try {
      const response = await axios.post("/api/tape/search", searchData);
      onSearch(response.data);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        const response = await axios.get("/api/systems");
        setSystemData(response.data);
      } catch (error) {
        console.error("Error fetching system data:", error);
      }
    };
    fetchSystemData();
  }, []);

  useEffect(() => {
    const fetchSubSystems = async () => {
      try {
        const response = await axios.get(
          `/api/systems/subsystems/${parentSystem.sysId}`
        );
        setSubSystems(response.data);
      } catch (error) {
        console.error("Error fetching sub-systems:", error);
      }
    };
    if (parentSystem.sysId) {
      fetchSubSystems();
    }
  }, [parentSystem.sysId]);

  return (
    <ContainerStyled
      maxWidth="xl"
      sx={{ background: colorPalette.black1[500] }}
    >
      <HeaderStyled variant="h4"></HeaderStyled>
      <SearchFormStyled onSubmit={handleSubmit}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={15} sm={2} className={SearchInputGroupStyled}>
            <TextField
              label="Tape ID"
              value={tapeId}
              onChange={(e) => setTapeId(e.target.value)}
              fullWidth
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={15} sm={2} className={SearchInputGroupStyled}>
            <FormControl fullWidth sx={textFieldStyles}>
              <InputLabel id="system-select-label">System</InputLabel>
              <Select
                labelId="system-select-label"
                value={parentSystem.sysName}
                label="System"
                onChange={(e) => {
                  const selectedSystem = systemData.find(
                    (system) => system.sysName === e.target.value
                  );
                  setParentSystem({
                    sysName: selectedSystem.sysName,
                    sysId: selectedSystem.sysId,
                  });
                }}
              >
                {systemData.map((system) => (
                  <MenuItem key={system.sysId} value={system.sysName}>
                    {system.sysName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={15} sm={2} className={SearchInputGroupStyled}>
            <FormControl fullWidth sx={textFieldStyles}>
              <InputLabel id="subsystem-select-label">Sub System</InputLabel>
              <Select
                labelId="subsystem-select-label"
                value={subSysName}
                label="Sub System"
                onChange={(e) => setSubSysName(e.target.value)}
              >
                {subSystems.length > 0 ? (
                  subSystems.map((system) => (
                    <MenuItem key={system.subSysId} value={system.subSysName}>
                      {system.subSysName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="">
                    No sub systems available
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={15} sm={2} className={SearchInputGroupStyled}>
            <TextField
              select
              label="Backup Status"
              value={backupStatus}
              onChange={(e) => setBackupStatus(e.target.value)}
              fullWidth
              sx={textFieldStyles}
            >
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Not Taken">Not Taken</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={15} sm={2} className={SearchInputGroupStyled}>
            <TextField
              select
              label="Media Type"
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              fullWidth
              sx={textFieldStyles}
            >
              <MenuItem value="LTO6">LTO6</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={15} sm={2} className={SearchInputGroupStyled}>
            <TextField
              select
              label="Tape Status"
              value={tapeStatus}
              onChange={(e) => setTapeStatus(e.target.value)}
              fullWidth
              sx={textFieldStyles}
            >
              <MenuItem value="Completed">Full</MenuItem>
              <MenuItem value="Ongoing">IN Use</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={15} sm={2} className={SearchInputGroupStyled}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newStartDate) => setStartDate(newStartDate)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={15} sm={2} className={SearchInputGroupStyled}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newEndDate) => setEndDate(newEndDate)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={15} sm={2} className={SearchInputGroupStyled}>
            <TextField
              select
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              sx={textFieldStyles}
            >
              <MenuItem value="Head Office">Head Office</MenuItem>
              <MenuItem value="DR Nugegoda">DR Nugegoda</MenuItem>
              <MenuItem value="DR Maharagama">DR Maharagama</MenuItem>
              <MenuItem value="HO to DRN">HO to DRN</MenuItem>
              <MenuItem value="HO to DRM">HO to DRM</MenuItem>
              <MenuItem value="DRN to DRM">DRN to DRM</MenuItem>
              <MenuItem value="DRM to DRN">DRM to DRN</MenuItem>
              <MenuItem value="DRN to HO">DRN to HO</MenuItem>
              <MenuItem value="DRM to HO">DRM to HO</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={15} sm={2} className={SearchInputGroupStyled} sx={{display: 'flex', justifyContent: 'center'}}>
            <Button type="submit" variant="contained" color="primary" sx={{height: '50px'}}>
              Search Tape
            </Button>
          </Grid>
        </Grid>
      </SearchFormStyled>
    </ContainerStyled>
  );
}

export default Search;
