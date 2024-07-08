import React, { useState } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { colorPalette } from "customTheme";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FlexBetween from "components/FlexBetween";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import textFieldStyles from "styles/textFieldStyles";

const SelectTapeStock = ({ open, handleClickClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [tapeId, setTapeId] = useState("");
  const [mediaType, setMediaType] = useState("");
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
      window.location.reload();
    } catch (err) {
      toast.error(err.response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.log(err.response.data.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClickClose}>
      <DialogTitle sx={{ bgcolor: colorPalette.black[500], color: "#fff" }}>
        Select Tape Stock
      </DialogTitle>
      <DialogContent sx={{ bgcolor: colorPalette.black[500], width: "40vw" }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
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
                  bgcolor: colorPalette.yellow[500],
                  "&:hover": { bgcolor: colorPalette.yellow[600] },
                }}
              >
                Change Tape ID
              </Button>
            </Box>
          </form>
        )}

        {showNewTapeForm && (
          <form>
            <Box sx={{ width: "100%", marginTop: "1rem" }}>
              <FormControl sx={textFieldStyles}>
                <InputLabel id="demo-simple-select-autowidth-label">
                  Media Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value)}
                  autoWidth
                  label="Age"
                >
                  <MenuItem value={"LTO1"}>LTO1</MenuItem>
                  <MenuItem value={"LTO2"}>LTO2</MenuItem>
                  <MenuItem value={"LTO3"}>LTO3</MenuItem>
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
