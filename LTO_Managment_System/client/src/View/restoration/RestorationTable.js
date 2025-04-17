import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from "@mui/material";
import { colorPalette } from "customTheme";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Edit, Delete, Add, Search, ArrowBack } from "@mui/icons-material";
import Header from "components/Header";
import { Helmet } from "react-helmet-async";

const RestorationTable = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [restorations, setRestorations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRestoration, setSelectedRestoration] = useState(null);

  useEffect(() => {
    fetchRestorations();
  }, []);

  const fetchRestorations = async () => {
    try {
      const response = await axios.get("/api/restoration/getAllRestorations");
      setRestorations(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch restoration data", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleDeleteClick = (restoration) => {
    setSelectedRestoration(restoration);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/restoration/deleteRestoration/${selectedRestoration.id}`);
      toast.success("Restoration deleted successfully!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      fetchRestorations();
      setOpenDeleteDialog(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const filteredRestorations = restorations.filter((restoration) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      restoration.requesterName.toLowerCase().includes(searchTermLower) ||
      restoration.department.toLowerCase().includes(searchTermLower) ||
      restoration.object.toLowerCase().includes(searchTermLower) ||
      restoration.library.toLowerCase().includes(searchTermLower) ||
      restoration.destinationSystem.toLowerCase().includes(searchTermLower)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Helmet>
        <title>Restoration Management</title>
      </Helmet>
      
      <Box
        sx={{
          width: "100%",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          mb: 3,
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
          <ArrowBack />
        </IconButton>
        <Header
          title="Restoration Management"
          subtitle="View and manage restoration records"
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/restoration/add")}
          sx={{
            backgroundColor: colorPalette.yellow[500],
            color: colorPalette.black2[500],
            "&:hover": {
              backgroundColor: colorPalette.yellow[400],
            },
          }}
        >
          Add New Restoration
        </Button>

        <TextField
          variant="outlined"
          placeholder="Search..."
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />,
          }}
        />
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="restoration table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Requester</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Object</TableCell>
                <TableCell>Library</TableCell>
                <TableCell>System</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRestorations
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((restoration) => (
                  <TableRow key={restoration.id}>
                    <TableCell>{formatDate(restoration.date)}</TableCell>
                    <TableCell>{restoration.requesterName}</TableCell>
                    <TableCell>{restoration.department}</TableCell>
                    <TableCell>{restoration.object}</TableCell>
                    <TableCell>{restoration.library}</TableCell>
                    <TableCell>{restoration.destinationSystem}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => navigate(`/restoration/edit/${restoration.id}`)}
                        sx={{ color: theme.palette.secondary[300] }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(restoration)}
                        sx={{ color: theme.palette.secondary[300] }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRestorations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the restoration record for{" "}
            <strong>{selectedRestoration?.requesterName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ color: colorPalette.secondary[100] }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            sx={{
              backgroundColor: colorPalette.red[500],
              color: colorPalette.black2[500],
              "&:hover": {
                backgroundColor: colorPalette.red[400],
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RestorationTable;