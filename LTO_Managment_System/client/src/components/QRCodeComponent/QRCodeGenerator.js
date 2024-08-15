// QRCodeGenerator.js
import React, { useRef } from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import QRCode from "react-qr-code";

const QRCodeGenerator = ({ open, onClose, data }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>QR Code</DialogTitle>
      <DialogContent>
        <div ref={printRef} style={{ width: "2in", height: "2in" }}>
          <QRCode value={data} size={200} /> {/* Adjust size as needed */}
        </div>
        <Button onClick={handlePrint} variant="contained" sx={{ mt: 2 }}>
          Print
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeGenerator;