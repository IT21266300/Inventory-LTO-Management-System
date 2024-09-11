import React from "react";
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
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import textFieldStyles from "styles/textFieldStyles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const positions = ["Admin", "Operator", "Read Only"];

// const teams = [
//   'Project Team',
//   'Revanue & Commercial Team',
//   'Warehouse Operation Team',
//   'Rollout Team',
//   'Document Team',
// ];

const AddLocker = () => {
  const navigate = useNavigate();
  const [lockerId, setLockerId] = useState();
  const [capacity, setCapacity] = useState("");
  const [currentCount, setCurrentCount] = useState("");
  const [tLevels, setTLevels] = useState("");
  const [tColumns, setTColumns] = useState("");
  const [tDepth, setTDepth] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/lockerH/addLocker", {
        lockerId,
        capacity,
        currentCount,
        tLevels,
        tColumns,
        tDepth
      });
      toast.success("New locker has been added successfully!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate("/headOfficeL");
      window.location.reload();
    } catch (err) {
      console.log(err);
      toast.error(err.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  console.log(lockerId, currentCount, capacity, tColumns, tLevels, tDepth);

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
            Add New Locker Details
          </Typography>
        </Box>
        <form onSubmit={submitHandler}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              name="lockerId"
              label="Locker ID"
              variant="outlined"
              type="text"
              sx={textFieldStyles}
              onChange={(e) => setLockerId(e.target.value)}
              required
            />
            <TextField
              name="capacity"
              label="Capacity"
              variant="outlined"
              type="number"
              sx={textFieldStyles}
              required
              onChange={(e) => setCapacity(e.target.value)}
            />
            <TextField
              name="Current Count"
              label="currentCount"
              variant="outlined"
              type="number"
              required
              sx={textFieldStyles}
              onChange={(e) => setCurrentCount(e.target.value)}
            />
            <TextField
              name="T Levels"
              label="tLevels"
              variant="outlined"
              type="number"
              sx={textFieldStyles}
              required
              onChange={(e) => setTLevels(e.target.value)}
            />

            <TextField
              name="T Columns"
              label="tColumns"
              variant="outlined"
              type="number"
              sx={textFieldStyles}
              required
              onChange={(e) => setTColumns(e.target.value)}
            />

            <TextField
              name="T Depth"
              label="tDepth"
              variant="outlined"
              type="number"
              sx={textFieldStyles}
              required
              onChange={(e) => setTDepth(e.target.value)}
            />

            <FlexBetween>
              <Button
                onClick={() => navigate("/headOfficeL")}
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
                Add new Locker
              </Button>
            </FlexBetween>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default AddLocker;
