// backend/index.js
// Import Packages
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import winston from 'winston';
import { format } from 'winston';
import moment from 'moment';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mysql from 'mysql2'; // Import MySQL driver

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
      filename: path.join(logDir, `staff_activity_${moment().format('YYYY-MM-DD')}.log`),
      // maxsize: 5242880, // 5MB file size limit
      // maxFiles: 5, // rotate logs, keep up to 5 files
      tailable: true // stream the log output
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

const PORT = process.env.PORT || 3306;

// Middleware for logging staff activities
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    // Get staff ID from request (assuming you have staff authentication)
    const staffId = req.user ? req.user.staffId : "";

    // Add a success flag to log object based on the response status
    let success = false; // Initialize success as false
    res.on('finish', () => {
      success = res.statusCode >= 200 && res.statusCode < 300; // Consider 2xx as success
      // Log the request details
      logger.info({
        staffId,
        method: req.method,
        url: req.url,
        ip: req.ip,
        success // Add success flag to log
      });
    });
  }
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
    console.error('Error fetching active staff:', error.message);
    res.status(500).send('Error fetching active staff');
  }
});

// Route to retrieve log entries and combine them with staff details
app.get('/logs', async (req, res) => {
  try {
    // Read all log files in the log directory
    const files = fs.readdirSync(logDir).filter(file => file.endsWith('.log'));

    let logs = [];

    // Read each log file and parse the JSON entries
    for (const file of files) {
      const data = fs.readFileSync(path.join(logDir, file), 'utf-8');
      const lines = data.split('\n').filter(line => line);
      const entries = lines.map(line => JSON.parse(line));
      logs = logs.concat(entries);
    }

    // Fetch staff details
    const connection = await mysql.createConnection(db);
    const [staffRows] = await connection.execute('SELECT staffId, name FROM staff');
    const staffMap = staffRows.reduce((acc, row) => {
      acc[row.staffId] = row.name;
      return acc;
    }, {});

    // Combine logs with staff details
    logs = logs.map(log => ({
      ...log,
      staffName: staffMap[log.staffId] || 'Unknown'
    }));

    await connection.end();
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error.message);
    res.status(500).send('Error fetching logs');
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
        console.error('Error downloading log file:', err.message);
        return res.status(500).send('Error downloading log file');
      }
    } else {
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename=${logFile}`);
      res.send(data); 
    }
  });
});


// Route to get a list of log files
app.get('/api/logs', (req, res) => {
  fs.readdir(logDir, (err, files) => {
    if (err) {
      logger.error('Error reading log files:', err); // Log the error
      res.status(500).send('Error reading log files');
      return;
    }
    const logFiles = files.map(file => ({
      fileName: file,
      createdAt: fs.statSync(path.join(logDir, file)).birthtime
    }));
    res.json(logFiles);
  });
});

// Route to download a specific log file
app.get('/api/logs/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(logDir, fileName);
  res.sendFile(filePath);
});

// **New Route for Search (search by filename)**
app.get('/api/logs/search', (req, res) => {
  const query = req.query.query; // Get the search term from the query parameter

  fs.readdir(logDir, (err, files) => {
    if (err) {
      logger.error('Error reading log files:', err); // Log the error
      res.status(500).send('Error reading log files');
      return;
    }

    // Filter log files based on the query (filename)
    const matchingFiles = files.filter(file => {
      // Simple search logic - check if file name contains the query
      return file.toLowerCase().includes(query.toLowerCase()); 
    });

    // Create an array of log file objects
    const logFiles = matchingFiles.map(file => ({
      fileName: file,
      createdAt: fs.statSync(path.join(logDir, file)).birthtime
    }));

    res.json(logFiles); // Send the filtered log files as JSON
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