import React, { useState } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  IconButton,
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
  const [showReuseForm, setShowReuseForm] = useState(false); // Track if reuse form is visible

  const openShowReuseForm = () => {
    setShowReuseForm(true);
  };

  const closeShowReuseForm = () => {
    setShowReuseForm(true);
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
            onClick={() => {
              navigate("/newTape");
            }}
            variant="outlined"
            sx={{ color: "#fff", borderColor: "#fff" }}
          >
            New Tape
          </Button>
          <Button
            onClick={openShowReuseForm} // Show the reuse form
            variant="contained"
            sx={{
              bgcolor: colorPalette.yellow[500],
              "&:hover": { bgcolor: colorPalette.yellow[600] },
            }}
          >
            Reuse Tape
          </Button>
        </Box>
        {showReuseForm && ( // Show the reuse form if showReuseForm is true
          <form onSubmit={submitHandler}>
            <Box sx={{ width: "100%", marginTop: "1rem"}}>
              <TextField
                name="tapeId"
                label="Tape ID"
                variant="outlined"
                type="text"
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
      </DialogContent>
    </Dialog>
  );
};

export default SelectTapeStock;
