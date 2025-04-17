import express from 'express';
import db from '../../dbConnection.js';

const router = express.Router();

// Function to validate input data
function validateRestorationInput(data) {
  const requiredFields = [
    'date', 'requesterName', 'department', 'contactNo', 'object', 
    'library', 'tapeDate', 'tapeType', 'destinationSystem', 
    'destinationLibrary', 'aspBefore', 'aspAfter', 'daysRetained',
    'restoredBy', 'restoredSignature', 'removalDate', 'removedBySignature'
  ];
  
  for (const field of requiredFields) {
    if (!data[field]) {
      return false;
    }
  }
  return true;
}

// Function to sanitize input data
function sanitizeRestorationInput(data) {
  const sanitized = {};
  for (const key in data) {
    if (typeof data[key] === 'string') {
      sanitized[key] = data[key].trim();
    } else {
      sanitized[key] = data[key];
    }
  }
  return sanitized;
}

// Add new restoration record
router.route('/addRestoration').post(async (req, res) => {
  const restorationData = req.body;
  
  if (!validateRestorationInput(restorationData)) {
    return res.status(400).json({ message: 'Invalid input data - missing required fields' });
  }

  const sanitizedData = sanitizeRestorationInput(restorationData);

  const sql = `
    INSERT INTO Restoration (
      date, requesterName, department, contactNo, object, library, 
      tapeDate, tapeType, destinationSystem, destinationLibrary, 
      aspBefore, aspAfter, remarks, objectRenamedAs, daysRetained,
      restoredBy, restoredSignature, removalDate, removedBySignature, lastUpdate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    sanitizedData.date,
    sanitizedData.requesterName,
    sanitizedData.department,
    sanitizedData.contactNo,
    sanitizedData.object,
    sanitizedData.library,
    sanitizedData.tapeDate,
    sanitizedData.tapeType,
    sanitizedData.destinationSystem,
    sanitizedData.destinationLibrary,
    sanitizedData.aspBefore,
    sanitizedData.aspAfter,
    sanitizedData.remarks || null,
    sanitizedData.objectRenamedAs || null,
    sanitizedData.daysRetained,
    sanitizedData.restoredBy,
    sanitizedData.restoredSignature,
    sanitizedData.removalDate,
    sanitizedData.removedBySignature,
    sanitizedData.lastUpdate
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error adding restoration record', error: err.message });
    }
    return res.status(201).json({ message: 'Restoration record added successfully', id: result.insertId });
  });
});

// Get all restoration records
router.route('/getAllRestorations').get((req, res) => {
  const sql = 'SELECT * FROM Restoration ORDER BY date DESC';
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error fetching restoration records', error: err.message });
    }
    return res.json(results);
  });
});

// Get single restoration record by ID
router.route('/:id').get((req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM Restoration WHERE id = ?';
  
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error fetching restoration record', error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Restoration record not found' });
    }
    return res.json(results[0]);
  });
});

// Update restoration record
router.route('/updateRestoration/:id').put(async (req, res) => {
  const { id } = req.params;
  const restorationData = req.body;
  
  if (!validateRestorationInput(restorationData)) {
    return res.status(400).json({ message: 'Invalid input data - missing required fields' });
  }

  const sanitizedData = sanitizeRestorationInput(restorationData);

  const sql = `
    UPDATE Restoration SET 
      date = ?, requesterName = ?, department = ?, contactNo = ?, object = ?, 
      library = ?, tapeDate = ?, tapeType = ?, destinationSystem = ?, 
      destinationLibrary = ?, aspBefore = ?, aspAfter = ?, remarks = ?, 
      objectRenamedAs = ?, daysRetained = ?, restoredBy = ?, 
      restoredSignature = ?, removalDate = ?, removedBySignature = ?, 
      lastUpdate = ?
    WHERE id = ?
  `;

  const values = [
    sanitizedData.date,
    sanitizedData.requesterName,
    sanitizedData.department,
    sanitizedData.contactNo,
    sanitizedData.object,
    sanitizedData.library,
    sanitizedData.tapeDate,
    sanitizedData.tapeType,
    sanitizedData.destinationSystem,
    sanitizedData.destinationLibrary,
    sanitizedData.aspBefore,
    sanitizedData.aspAfter,
    sanitizedData.remarks || null,
    sanitizedData.objectRenamedAs || null,
    sanitizedData.daysRetained,
    sanitizedData.restoredBy,
    sanitizedData.restoredSignature,
    sanitizedData.removalDate,
    sanitizedData.removedBySignature,
    sanitizedData.lastUpdate,
    id
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error updating restoration record', error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Restoration record not found' });
    }
    return res.json({ message: 'Restoration record updated successfully' });
  });
});

// Delete restoration record
router.route('/deleteRestoration/:id').delete(async (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Restoration WHERE id = ?';
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error deleting restoration record', error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Restoration record not found' });
    }
    return res.json({ message: 'Restoration record deleted successfully' });
  });
});

export default router;