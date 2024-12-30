import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import db from "../../../dbConnection.js";

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
    const { lockerId, capacity, currentCount, tLevels, tColumns, tDepth, lastUpdate} = req.body;
  
    // Validate input data
    if (validateLockerInput(lockerId, capacity, currentCount, tLevels, tColumns, tDepth, lastUpdate)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }
  
    // Sanitize input data
    const sanitizedInput = sanitizeLockerInput(lockerId, capacity, currentCount, tLevels, tColumns, tDepth, lastUpdate);
  
    // Check if the lockerId already exists
    const checkSql = 'SELECT * FROM LockerP WHERE lockerId = ?';
    db.query(checkSql, [sanitizedInput.lockerId], (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
  
      if (results.length > 0) {
        console.log(results);
        return res.status(409).json({ message: 'Locker ID already in use' });
      }

      if(sanitizedInput.capacity < sanitizedInput.currentCount){
        return res.status(409).json({ message: 'Current Count cannot be exceed..!' });
      }
  
      // Insert the new Locker
      const insertSql = 'INSERT INTO LockerP (lockerId, capacity, currentCount, tLevels, tColumns, tDepth, lastUpdate) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.query(insertSql, [
        sanitizedInput.lockerId,
        sanitizedInput.capacity,
        sanitizedInput.currentCount,
        sanitizedInput.tLevels,
        sanitizedInput.tColumns,
        sanitizedInput.tDepth,
        req.body.lastUpdate
      
      ], (err, result) => {
        if (err) return res.status(400).json({ message: err.message });
        console.log(res);
        return res.json({ message: 'New Locker added..!' });
      });
    });
  });
  
  router.route('/').get((req, res) => {
    const sql = 'SELECT * FROM LockerP';
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });


  router.route('/deleteLocker/:lockerId').delete(async (req, res) => {
    const { lockerId } = req.params;
  
    const sql = 'DELETE FROM LockerP WHERE lockerId = ?';
    
    db.query(sql, [lockerId], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({ status: 'Error with deleting tape', error: err.message });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).send({ status: 'Locker not found' });
      }
  
      return res.status(200).send({ status: 'Locker Deleted...!' });
    })
  });

  router.route('/LockerUpdate/:lockerId').put(async (req, res) => {
    const lockerId = req.params.lockerId;
    const { capacity, currentCount, tLevels, tColumns, tDepth, lastUpdate} = req.body;
  
    // if (validateLockerInput( lockerId, capacity, currentCount, tLevels, tColumns, tDepth)) {
    //   return res.status(400).json({ message: 'Invalid input data' });
    // }

    if(capacity < currentCount){
      return res.status(400).json({ message: 'Current cannot be exceed..!' });
    }
  
    // Sanitize input data
    const sanitizedInput = sanitizeLockerInput( lockerId, capacity, currentCount, tLevels, tColumns, tDepth, lastUpdate);
  
    // Check if the updated staffId already exists
    const checkSql = 'SELECT * FROM LockerP WHERE lockerId = ?';
    db.query(checkSql, [lockerId], (checkErr, checkResult) => {
      if (checkErr) {
        console.error(checkErr.message);
        return res.status(500).json({ message: 'Error with checking user', error: checkErr.message });
      }
  
      // Update the staff member
      const updateSql = 'UPDATE LockerP SET capacity = ?, currentCount = ?, tLevels = ?, tColumns = ?, tDepth = ?, lastUpdate = ? WHERE lockerId = ?';
      db.query(updateSql, [sanitizedInput.capacity, sanitizedInput.currentCount, sanitizedInput.tLevels, sanitizedInput.tColumns, sanitizedInput.tDepth, req.body.update, lockerId], (updateErr, updateResult) => {
        if (updateErr) {
          console.error(updateErr.message);
          return res.status(400).json({ message: 'Error with updating Locker', error: updateErr.message });
        }
  
        if (updateResult.affectedRows === 0) {
          return res.status(404).json({ message: 'Locker not found' });
        }
  
        return res.status(200).json({ message: 'Locker Updated' });
      });
    });
  });

export default router;
