import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { QrReader } from "react-qr-reader";

const QRCodeReader = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleScan = (data) => {
    if (data) {
      // Assuming the QR code data contains just the tape ID
      const tapeId = data;
      navigate(`/tape/${tapeId}`);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError("Failed to read QR code. Please try again.");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Scan QR Code
      </Typography>
      {error && (
        <Typography variant="body1" color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <Box
        sx={{
          width: "300px",
          height: "300px",
          marginBottom: "2rem",
        }}
      >
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "100%" }}
        />
      </Box>
    </Box>
  );
};

export default QRCodeReader;
