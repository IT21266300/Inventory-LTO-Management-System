import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import db from "../../dbConnection.js";

const router = express.Router();


// Function to validate input data 
function validateLockerInput(lockerId, capacity, currentCount, tLevels, tColumns, tDepth) {
    if (!lockerId || !capacity || !currentCount || !tLevels || !tColumns || !tDepth) {
      return false;
    }
    if (typeof lockerId !== 'string' || typeof capacity !== 'number' || typeof currentCount !== 'number' || typeof tLevels !== 'number' || typeof tColumns !== 'number' || typeof tDepth !== 'number') {
      return false;
    }
    return true; 
  }
  
  // Function to sanitize input data
  function sanitizeLockerInput(lockerId, capacity, currentCount, tLevels, tColumns, tDepth) {
    return {
      lockerId: lockerId.trim(),
      capacity, 
      currentCount,
      tLevels,
      tColumns,
      tDepth,
      
    };
  }
  
  router.route('/addLocker').post(async (req, res) => {
    const { lockerId, capacity, currentCount, tLevels, tColumns, tDepth} = req.body;
  
    // Validate input data
    if (!validateLockerInput(lockerId, capacity, currentCount, tLevels, tColumns, tDepth)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }
  
    // Sanitize input data
    const sanitizedInput = sanitizeLockerInput(lockerId, capacity, currentCount, tLevels, tColumns, tDepth);
  
    // Check if the lockerId already exists
    const checkSql = 'SELECT * FROM Locker WHERE lockerId = ?';
    db.query(checkSql, [sanitizedInput.lockerId], (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
  
      if (results.length > 0) {
        return res.status(409).json({ message: 'Locker ID already in use' });
      }
  
      // Insert the new Locker
      const insertSql = 'INSERT INTO Locker (lockerId, capacity, currentCount, tLevels, tColumns, tDepth) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(insertSql, [
        sanitizedInput.lockerId,
        sanitizedInput.capacity,
        sanitizedInput.currentCount,
        sanitizedInput.tLevels,
        sanitizedInput.tColumns,
        sanitizedInput.tDepth,
      
      ], (err, result) => {
        if (err) return res.status(400).json({ message: err.message });
        return res.json({ message: 'New Locker added..!' });
      });
    });
  });
  
  router.route('/').get((req, res) => {
    const sql = 'SELECT * FROM Locker';
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

export default router;
