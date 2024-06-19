// import Packages
import express, { Router } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import mysql from 'mysql2';
import fs from 'fs';
import path from 'path';
import winston from 'winston';
import { format } from 'winston';

// import routes
import routes from './lib/routes.js';

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    // Log to file (default)
    new winston.transports.File({ filename: 'staff_activity_%DATE%.log' })
  ]
});

//configuration
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const PORT = process.env.PORT || 3308;

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Middleware for logging staff activities
app.use((req, res, next) => {
  // Get staff ID from request (assuming you have staff authentication)
  const staffId = req.user ? req.user.staffId : "";

  if (req.method === 'GET') {
    next();
    return; 
  }


  // Log the request details
  logger.info({
    //timestamp: Date.now(),
    staffId,
    method:req.method,
    url: req.url,
    ip: req.ip,
    //userAgent: req.headers['user-agent']
  });

  next();
});

// Route to download log file
app.get('/download-log', (req, res) => {
  const logDir = path.join(__dirname); // Directory where log files are stored
  const logFiles = fs.readdirSync(logDir).filter(file => 
    file.startsWith('staff_activity_')); 

  // Combine all log files into a single string
  let logData = "";
  logFiles.forEach(file => {
    const filePath = path.join(logDir, file);
    logData += fs.readFileSync(filePath, 'utf8') + "\n"; // Add newline for separation
  });

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename=staff_activity.log');

  res.send(logData); 
});
  // Read the log file and send it as response
//   fs.readFile(filePath, (err, data) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error downloading log file');
//     } else {
//       res.send(data);
//     }
//   });
// });

app.listen(PORT, () => {
  console.log("running");
});

// Router calls
app.use('/api', routes);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});