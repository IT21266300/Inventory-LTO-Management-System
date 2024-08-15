import React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import QRCode from "qrcode.react";

const QRCodeComponent = ({ tapeId }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: "2rem",
        marginBottom: "2rem",
        borderRadius: "10px",
        backgroundColor: "#fff",
        color: "#000",
        textAlign: "center",
      }}
    >
      <Typography variant="h6" gutterBottom>
        QR Code for Tape ID: {tapeId}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <QRCode value={tapeId} size={200} />
      </Box>
      <Button
        variant="contained"
        onClick={handlePrint}
        sx={{
          backgroundColor: "#ffe404",
          color: "#fff",
        }}
      >
        Print QR Code
      </Button>
    </Paper>
  );
};

export default QRCodeComponent;
