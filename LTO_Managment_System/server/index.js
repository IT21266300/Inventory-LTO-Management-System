// Import Packages
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import winston from 'winston';
import { format } from 'winston';
import moment from 'moment'; // Add moment for date formatting
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import routes
import routes from './lib/routes.js';

import db from './dbConnection.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure Winston logger
const logDir = path.join(__dirname, 'logs'); 

// Check if the log directory exists, create it if not
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
    format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: path.join(logDir, `staff_activity_${moment().format('YYYY-MM-DD')}.log`) 
    }) 
  ]
});

// Configuration
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(cors());

const PORT = process.env.PORT || 3308;

// Middleware for logging staff activities
app.use((req, res, next) => {
  // Get staff ID from request (assuming you have staff authentication)
  const staffId = req.user ? req.user.staffId : "";

  // Add a success flag to log object based on the response status
  let success = true; // Initialize success as false
  res.on('finish', () => {
    success = res.statusCode >= 200 && res.statusCode < 300; // Consider 2xx as success
  });

  if (req.method === 'GET') {
    next();
    return; 
  }

  // Log the request details
  logger.info({
    staffId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    //userAgent: req.headers['user-agent'],
    success // Add success flag to log
  });

  next();
});

// Route to get currently active staff IDs 
app.get('/active-staff', async (req, res) => {
  try {
    // Create MySQL connection (promise-based)
    const connection = await mysql.createConnection(db);

    // Replace with your actual query to fetch staff IDs from your staff table
    const [rows] = await connection.execute('SELECT staffId FROM staff WHERE isActive = 1'); // Example: assumes an 'isActive' column

    // Extract staff IDs from the results
    const staffIds = rows.map(row => row.staffId); 

    res.json({ staffIds }); 

    // Close the connection
    await connection.end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching active staff');
  }
});

// Route to download log file for a specific day
app.get('/download-log/:date', (req, res) => {
  const date = req.params.date; 
  const logFile = `staff_activity_${date}.log`; 
  const filePath = path.join(logDir, logFile);

  // Read and send the log file if it exists
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).send('Log file not found.');
      } else {
        console.error(err);
        return res.status(500).send('Error downloading log file');
      }
    } else {
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename=${logFile}`);
      res.send(data); 
    }
  });
});

// Router calls
app.use('/api', routes);

// Global error handler
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});