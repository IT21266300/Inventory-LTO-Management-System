import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr'; // Import jsQR

const QrCodeReader = ({ onScan }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    };
    
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (scanning) {
      const scanQRCode = () => {
        if (canvasRef.current && videoRef.current) {
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, canvas.width, canvas.height);

          if (code) {
            onScan(code.data); // Pass the scanned QR code (tape ID) to the parent component
            setScanning(false); // Stop scanning after success
          }
        }
      };

      const interval = setInterval(scanQRCode, 1000); // Try scanning every second
      return () => clearInterval(interval);
    }
  }, [scanning, onScan]);

  return (
    <div>
      <h2>QR Code Reader</h2>
      <video
        ref={videoRef}
        style={{ width: '100%', height: 'auto' }}
        onPlay={() => setScanning(true)} // Start scanning when the video plays
        autoPlay
      ></video>
      <canvas ref={canvasRef} style={{ display: 'none' }} width={640} height={480}></canvas>
    </div>
  );
};

export default QrCodeReader;
