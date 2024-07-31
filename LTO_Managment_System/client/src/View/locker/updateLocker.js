import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  IconButton,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { colorPalette } from "customTheme";
import FlexBetween from "components/FlexBetween";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { useNavigate, useLocation } from "react-router-dom";
import textFieldStyles from "styles/textFieldStyles";
import axios from "axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { toast } from "react-toastify"; // Import toast

const positions = ["Admin", "Operator", "Read Only"];

const UpdateLocker = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data } = location.state; // Get locker data from location state
console.log(data);

  const [lockerId, setLockerId] = useState(data?.lockerId || "");
  const [capacity, setCapacity] = useState(data?.capacity || "");
  const [currentCount, setCurrentCount] = useState(data?.currentCount || "");
  const [tLevels, setTLevels] = useState(data?.tLevels || "");
  const [tColumns, setTColumns] = useState(data?.tColumns || "");
  const [tDepth, setTDepth] = useState(data?.tDepth || "");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/locker/LockerUpdate/${data.lockerId}`, {
        capacity,
        currentCount,
        tLevels,
        tColumns,
        tDepth,
      });
      toast.success("Locker has been updated successfully!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate("/locker");
    } catch (err) {
      console.log(err);
      toast.error(err.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  // Use useEffect to populate form fields with initial data
  useEffect(() => {
    setLockerId(data?.lockerId || "");
    setCapacity(data?.capacity || "");
    setCurrentCount(data?.currentCount || "");
    setTLevels(data?.tLevels || "");
    setTColumns(data?.tColumns || "");
    setTDepth(data?.tDepth || "");
  }, [data]); // Depend on data to update when it changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "capacity":
        setCapacity(value);
        break;
      case "currentCount":
        setCurrentCount(value);
        break;
      case "tLevels":
        setTLevels(value);
        break;
      case "tColumns":
        setTColumns(value);
        break;
      case "tDepth":
        setTDepth(value);
        break;
      default:
        break;
    }
  };
  return (
    <Box
      width="100%"
      minHeight="20vh"
      p="3rem 0"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Box sx={{ width: 450 }}>
        <Box
          width="100%"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
            alignItems: "center",
            mb: "1.5rem",
          }}
        >
          <IconButton
            variant="solid"
            sx={{
              width: "40px",
              height: "40px",
              borderRadius: "100px",
              backgroundColor: colorPalette.yellow[500],
              color: colorPalette.black[500],
              "&:hover": {
                backgroundColor: colorPalette.yellow[500],
                color: colorPalette.black[500],
              },
            }}
          >
            <AccountCircleIcon />
          </IconButton>
          <Typography
            variant="h5"
            textAlign="center"
            sx={{ color: "#fff", mt: "1rem" }}
          >
            Update Locker Details
          </Typography>
        </Box>
        <form onSubmit={submitHandler}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {/* Locker ID field should be read-only */}
            <TextField
              name="lockerId"
              label="Locker ID"
              variant="outlined"
              type="text"
              sx={textFieldStyles}
              value={lockerId} // Set value from state
              disabled // Make it read-only
              required
            />
            <TextField
              name="capacity"
              label="Capacity"
              variant="outlined"
              type="number"
              sx={textFieldStyles}
              required
              value={capacity} // Set value from state
              onChange={(e) => setCapacity(e.target.value)}
            />
            <TextField
              name="Current Count"
              label="currentCount"
              variant="outlined"
              type="number"
              required
              sx={textFieldStyles}
              value={currentCount} // Set value from state
              onChange={(e) => setCurrentCount(e.target.value)}
            />
            <TextField
              name="T Levels"
              label="tLevels"
              variant="outlined"
              type="number"
              sx={textFieldStyles}
              required
              value={tLevels} // Set value from state
              onChange={(e) => setTLevels(e.target.value)}
            />

            <TextField
              name="T Columns"
              label="tColumns"
              variant="outlined"
              type="number"
              sx={textFieldStyles}
              required
              value={tColumns} // Set value from state
              onChange={(e) => setTColumns(e.target.value)}
            />

            <TextField
              name="T Depth"
              label="tDepth"
              variant="outlined"
              type="number"
              sx={textFieldStyles}
              required
              value={tDepth} // Set value from state
              onChange={(e) => setTDepth(e.target.value)}
            />

            <FlexBetween>
              <Button
                onClick={() => navigate("/locker")}
                sx={{
                  width: "45%",
                  color: colorPalette.secondary[100],
                  padding: "0.5rem 0",
                  borderColor: "#fff",
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <br />
              <Button
                variant="filled"
                type="submit"
                sx={{
                  width: "45%",
                  backgroundColor: colorPalette.yellow[500],
                  color: colorPalette.black2[500],
                  padding: "0.5rem 0",
                  "&:hover": {
                    backgroundColor: colorPalette.yellow[400],
                  },
                }}
              >
                Update Locker
              </Button>
            </FlexBetween>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default UpdateLocker;