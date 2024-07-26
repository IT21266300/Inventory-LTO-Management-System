import React, { useState } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { colorPalette } from "customTheme";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import textFieldStyles from "styles/textFieldStyles";

const SelectTapeStock = ({ open, handleClickClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [tapeId, setTapeId] = useState("");
  const [tapeType, setTapeType] = useState("");
  const [showReuseForm, setShowReuseForm] = useState(false); // Track if reuse form is visible
  const [showNewTapeForm, setShowNewTapeForm] = useState(false);

  const openShowReuseForm = () => {
    setShowReuseForm(true);
    setShowNewTapeForm(false);
  };

  const closeShowReuseForm = () => {
    setShowReuseForm(true);
  };

  const openShowNewTapeForm = () => {
    setShowNewTapeForm(true);
    setShowReuseForm(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Update the tape record with tapeReuse and set reuseTape to true
      await axios.put(`/api/tape/changeTapeStatus/${tapeId}`);
      toast.success("Reuse Tape, data has been updated successfully!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      handleClickClose();
      navigate(`/newTapeReuse`)
      // window.location.reload();
    } catch (err) {
      toast.error(err.response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.log(err.response.data.message);
    }
  };

  const newTapeSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // Update the tape record with tapeReuse and set reuseTape to true
      handleClickClose();
      navigate(`/newTape/${tapeType}`)
    } catch (err) {
      toast.error(err.response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.log(err.response.data.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClickClose}>
      <DialogTitle sx={{ bgcolor: colorPalette.black[500], color: "#fff", width: '100%'}}>
        Select Tape Stock
      </DialogTitle>
      <DialogContent sx={{ bgcolor: colorPalette.black[500]}}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            gap: '10rem'
          }}
        >
          <Button
            onClick={openShowNewTapeForm}
            variant={showNewTapeForm ? "contained" : "outlined"}
          >
            New Tape Type
          </Button>
          <Button
            onClick={openShowReuseForm} // Show the reuse form
            variant={showReuseForm ? "contained" : "outlined"}
          >
            Reuse Tape
          </Button>
        </Box>
        {showReuseForm && ( // Show the reuse form if showReuseForm is true
          <form onSubmit={submitHandler}>
            <Box sx={{ width: "100%", marginTop: "1rem" }}>
              <TextField
                name="tapeId"
                label="Tape ID"
                variant="outlined"
                type="text"
                value={tapeId}
                sx={textFieldStyles}
                required
                onChange={(e) => setTapeId(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor
                  : colorPalette.yellow[500],
                  "&:hover": { bgcolor: colorPalette.yellow[600] },
                }}
              >
                Change Tape ID
              </Button>
            </Box>
          </form>
        )}

        {showNewTapeForm && (
          <form onSubmit={newTapeSubmitHandler}>
            <Box sx={{ width: "100%", marginTop: "1rem" }}>
              <FormControl sx={textFieldStyles}>
                <InputLabel id="demo-simple-select-autowidth-label">
                  Tape Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={tapeType}
                  onChange={(e) => setTapeType(e.target.value)}
                  autoWidth
                  label="Tape Type"
                >
                  <MenuItem value={"LTO5"}>LTO5</MenuItem>
                  <MenuItem value={"LTO6"}>LTO6</MenuItem>
                  <MenuItem value={"LTO7"}>LTO7</MenuItem>
                  <MenuItem value={"LTO8"}>LTO8</MenuItem>
                  <MenuItem value={"LTO9"}>LTO9</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: colorPalette.yellow[500],
                  "&:hover": { bgcolor: colorPalette.yellow[600] },
                }}
              >
                Add New Tape
              </Button>
            </Box>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SelectTapeStock;
