import React, { useState } from 'react';
import QrCodeReader from '../components/QRCodeComponent/QRCodeReaderComponent'; // Import the QR Code reader component

const QRcheck = () => {
  const [tapeId, setTapeId] = useState('');

  const handleScan = (data) => {
    console.log("Scanned Tape ID: ", data);
    setTapeId(data); // Store the scanned tape ID
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>QR Code Scanner Test</h1>
      <p>Scan a QR code to retrieve the tape ID</p>

      <QrCodeReader onScan={handleScan} /> {/* QR code scanner component */}
      
      {tapeId && (
        <div style={{ marginTop: '20px' }}>
          <h3>Scanned Tape ID:</h3>
          <p>{tapeId}</p> {/* Display the scanned tape ID */}
        </div>
      )}
    </div>
  );
};

export default QRcheck;