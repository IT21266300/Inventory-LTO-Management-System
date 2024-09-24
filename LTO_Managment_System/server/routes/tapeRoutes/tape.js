import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import XLSX from 'xlsx';
import db from '../../dbConnection.js';

const router = express.Router();

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(xls|xlsx)$/)) {
      return cb(new Error('Only Excel files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Import Excel file API
router.post('/import_excel', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Insert data into the Tape table
    const insertSql = 'INSERT INTO Tape (tapeId, sysId, sysName, subSysName, dayoftheweek, bStatus, mType, tStatus, sDate, eDate, lStatus) VALUES ?';
    const values = jsonData.map(row => [
      row.tapeId,
      row.sysId,
      row.sysName,
      row.subSysName,
      row.dayoftheweek,
      row.bStatus,
      row.mType,
      row.tStatus,
      row.sDate,
      row.eDate,
      row.lStatus,
      row.sStatus
    ]);

    db.query(insertSql, [values], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Failed to import data', error: err.message });
      }
      res.json({ success: true, message: 'File imported successfully', importedRows: result.affectedRows });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error processing file', error: err.message });
  }
});

// Function to validate input data 
function validateTapeInput(tapeId, sysId, sysName, subSysName, dayoftheweek, bStatus, mType, tStatus, sDate, eDate, lStatus, sStatus) {
  if (!tapeId || !sysId || !sysName || !subSysName || !dayoftheweek || !bStatus || !mType || !tStatus || !sDate || !eDate || !lStatus || !sStatus) {
    return false;
  }
  if (typeof tapeId !== 'string' || typeof sysId !== 'number' || typeof sysName !== 'string' || typeof subSysName !== 'string' || typeof dayoftheweek !== 'string' || typeof mType !== 'string' || typeof tStatus !== 'string' || typeof sDate !== 'string' || typeof eDate !== 'string' || typeof lStatus !== 'string' || typeof sStatus !== 'string') {
    return false;
  }
  return true; 
}

// Function to sanitize input data
function sanitizeTapeInput(tapeId, sysId, sysName, subSysName, dayoftheweek, bStatus, mType, tStatus, sDate, eDate, lStatus, sStatus) {
  return {
    tapeId: tapeId.trim(),
    sysId, 
    sysName: sysName.trim(),
    subSysName: subSysName.trim(),
    dayoftheweek: dayoftheweek.trim(),
    bStatus: bStatus.trim(),
    mType: mType.trim(),
    tStatus: tStatus.trim(),
    sDate,
    eDate,
    lStatus: lStatus.trim(),
    sStatus: sStatus.trim(),
  };
}

router.route('/addTape').post(async (req, res) => {
  const { tapeId, sysId, sysName, subSysName, dayoftheweek, bStatus, mType, tStatus, sDate, eDate, lStatus, sStatus, lastUpdate} = req.body;

  // Validate input data
  if (!validateTapeInput(tapeId, sysId, sysName, subSysName, dayoftheweek, bStatus, mType, tStatus, sDate, eDate, lStatus, sStatus, lastUpdate)) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  // Sanitize input data
  const sanitizedInput = sanitizeTapeInput(tapeId, sysId, sysName, subSysName, dayoftheweek, bStatus, mType, tStatus, sDate, eDate, lStatus, sStatus, lastUpdate);

  // Check if the tapeId already exists
  const checkSql = 'SELECT * FROM Tape WHERE tapeId = ?';
  db.query(checkSql, [sanitizedInput.tapeId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length > 0) {
      return res.status(409).json({ message: 'Tape ID already in use' });
    }

    // Insert the new tape
    const insertSql = 'INSERT INTO Tape (tapeId, sysId, sysName, subSysName, dayoftheweek, bStatus, mType, tStatus, sDate, eDate, lStatus, sStatus, lastUpdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(insertSql, [
      sanitizedInput.tapeId,
      sanitizedInput.sysId,
      sanitizedInput.sysName,
      sanitizedInput.subSysName,
      sanitizedInput.dayoftheweek,
      sanitizedInput.bStatus,
      sanitizedInput.mType,
      sanitizedInput.tStatus,
      sanitizedInput.sDate,
      sanitizedInput.eDate,
      sanitizedInput.lStatus,
      sanitizedInput.sStatus,
      req.body.lastUpdate
    ], (err, result) => {
      if (err) return res.status(400).json({ message: err.message });
      return res.json({ message: 'New Tape added..!' });
    });
  });
});

router.route('/').get((req, res) => {
  const sql = 'SELECT * FROM Tape';
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

router.route('/:tapeId').get(async (req, res) => {
  const { tapeId } = req.params;
  const sql = 'SELECT * FROM Tape WHERE tapeId = ?';

  db.query(sql, [tapeId], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    if (data.length === 0) {
      return res.status(404).json({ message: 'Tape not found' });
    }

    return res.json(data);
  });
});


router.route('/subsystems/:systemId').get(async (req, res) => {
  const { systemId } = req.params;
  const sql = 'SELECT * FROM SubSystem WHERE parentSystemId = ?';

  db.query(sql, [systemId], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    if (data.length === 0) {
      return res.status(404).json({ message: 'Sub System not found..!' });
    }

    return res.json(data);
  });
});



// delete system
router.route('/delete/:tapeId').delete(async (req, res) => {
  const { tapeId } = req.params;

  const sql = 'DELETE FROM Tape WHERE tapeId = ?';
  
  db.query(sql, [tapeId], (err, result) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send({ status: 'Error with deleting tape', error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ status: 'Tape not found' });
    }

    return res.status(200).send({ status: 'Tape Deleted' });
  });
});


//update tape

router.route('/updateTape/:tapeId').put(async (req, res) => {
  const tapeId = req.params.tapeId;
  const { sysId, sysName, subSysName, dayoftheweek, bStatus, mType, tStatus, sDate, eDate, lStatus, sStatus } = req.body;

  // Check if the tape ID exists
  const checkSql = 'SELECT * FROM Tape WHERE tapeId = ?';
  db.query(checkSql, [tapeId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error(checkErr.message);
      return res.status(500).json({ message: 'Error with checking tape', error: checkErr.message });
    }

    if (checkResult.length === 0) {
      return res.status(404).json({ message: 'Tape not found' });
    }

    // Update the tape record
    const updateSql = 'UPDATE Tape SET sysName = ?, sysId = ?, subSysName = ?, dayoftheweek = ?, bStatus = ?, mType = ?, tStatus = ?, sDate = ?, eDate = ?, lStatus = ?, sStatus = ? WHERE tapeId = ?';
    db.query(updateSql, [sysName, sysId, subSysName, dayoftheweek, bStatus, mType, tStatus, sDate, eDate, lStatus, sStatus, tapeId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error(updateErr.message);
        return res.status(400).json({ message: 'Error with updating tape', error: updateErr.message });
      }

      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Tape not found' });
      }

      return res.status(200).json({ message: 'Tape Updated' });
    });
    
  });
});

//update tape status

router.route('/updateTapeStatus/:tapeId').put(async (req, res) => {
  const tapeId = req.params.tapeId;
  const { dayoftheweek, bStatus, tStatus, lStatus, sStatus } = req.body;

  // Check if the tape ID exists
  const checkSql = 'SELECT * FROM Tape WHERE tapeId = ?';
  db.query(checkSql, [tapeId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error(checkErr.message);
      return res.status(500).json({ message: 'Error with checking tape', error: checkErr.message });
    }

    if (checkResult.length === 0) {
      return res.status(404).json({ message: 'Tape not found' });
    }

    // Update the tape status record
    const updateSql = 'UPDATE Tape SET dayoftheweek = ?, bStatus = ?, tStatus = ?, lStatus = ?, sStatus = ? WHERE tapeId = ?';
    db.query(updateSql, [dayoftheweek, bStatus, tStatus, lStatus, sStatus, tapeId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error(updateErr.message);
        return res.status(400).json({ message: 'Error with updating tape', error: updateErr.message });
      }

      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Tape not found' });
      }

      return res.status(200).json({ message: 'Tape Updated', checkResult });
    });
    
  });
});

//update date status

router.route('/updateDateStatus/:tapeId').put(async (req, res) => {
  const tapeId = req.params.tapeId;
  const { sDate, eDate } = req.body;

  // Check if the tape ID exists
  const checkSql = 'SELECT * FROM Tape WHERE tapeId = ?';
  db.query(checkSql, [tapeId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error(checkErr.message);
      return res.status(500).json({ message: 'Error with checking tape', error: checkErr.message });
    }

    if (checkResult.length === 0) {
      return res.status(404).json({ message: 'Date not found' });
    }

    // Update the tape status record
    const updateSql = 'UPDATE Tape SET sDate = ?, edate = ? WHERE tapeId = ?';
    db.query(updateSql, [sDate, eDate, tapeId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error(updateErr.message);
        return res.status(400).json({ message: 'Error with updating date', error: updateErr.message });
      }

      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Date not found' });
      }

      return res.status(200).json({ message: 'Date Updated' });
    });
    
  });
});


//Update multiple tape location status
router.route('/updateTapeStatuses').put(async (req, res) => {
  const { tapeIds, lStatus, sStatus } = req.body;

  if (!Array.isArray(tapeIds) || tapeIds.length === 0) {
    return res.status(400).json({ message: 'Invalid tape IDs' });
  }

  // Check if the tape IDs exist
  const checkSql = 'SELECT tapeId, sysName, subSysName FROM Tape WHERE tapeId IN (?)';
  db.query(checkSql, [tapeIds], (checkErr, checkResult) => {
    if (checkErr) {
      console.error(checkErr.message);
      return res.status(500).json({ message: 'Error with checking tapes', error: checkErr.message });
    }

    if (checkResult.length !== tapeIds.length) {
      return res.status(404).json({ message: 'One or more tapes not found' });
    }

    // Update the tape status records
    const updateSql = 'UPDATE Tape SET lStatus = ? WHERE tapeId IN (?)';
    db.query(updateSql, [lStatus, tapeIds], (updateErr, updateResult) => {
      if (updateErr) {
        console.error(updateErr.message);
        return res.status(400).json({ message: 'Error with updating tapes', error: updateErr.message });
      }

      return res.status(200).json({ message: 'Tape statuses updated successfully', checkResult});
    });
  });
});

// tape contents manage

router.route('/addTapeDetails').post(async (req, res) => {
  const { tapeId, date, remarks, tapeContent } = req.body;


    // Insert the new tape
    const insertSql = 'INSERT INTO TapeDetails (tapeId, date, remarks, tapeContent ) VALUES (?, ?, ?, ?)';
    db.query(insertSql, [tapeId, date, remarks, tapeContent ], (err, result) => {
      if (err) return res.status(400).json({ message: err.message });
      return res.json({ message: 'New Tape details add..!' });
    });
  
});


router.route('/tapeContent/:tapeId').get(async (req, res) => {
  const { tapeId } = req.params;
  const sql = 'SELECT * FROM TapeDetails where tapeId = ?';

  db.query(sql, [tapeId], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    if (data.length === 0) {
      return res.status(404).json({ message: 'Sub System not found..!' });
    }

    return res.json(data);
  });
});



router.route('/deleteTapeContent/:tapeId/:date').delete(async (req, res) => {
  const { tapeId, date } = req.params;

  const sql = 'DELETE FROM tapedetails WHERE tapeId = ? AND date = ?';
  
  db.query(sql, [tapeId, date], (err, result) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send({ status: 'Error with deleting tape', error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ status: 'Tape Content not found' });
    }

    return res.status(200).send({ status: 'Tape Content Deleted...!' });
  })
})
           
// Search for Tapes
// router.post('/search', async (req, res) => {
//   try {
//     const { tapeId, systemName, applicationName, backupStatus, mediaType, tapeStatus, startDate, endDate, location } = req.body;

router.route('/changeTapeStatus/:tapeId').put(async (req, res) => {
  const tapeId = req.params.tapeId;

  // Check if the tape ID exists
  const checkSql = 'SELECT * FROM Tape WHERE tapeId = ?';
  db.query(checkSql, [tapeId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error(checkErr.message);
      return res.status(500).json({ message: 'Error with checking tape', error: checkErr.message });
    }

    if (checkResult.length === 0) {
      return res.status(404).json({ message: 'Tape not found' });
    }

    if (checkResult[0].isReUse === 1) {
      return res.status(404).json({ message: 'Already Reuse' });
    }

    // Update the tape status record
    const updateSql = 'UPDATE Tape SET isReUse = ?';
    db.query(updateSql, [1], (updateErr, updateResult) => {
      if (updateErr) {
        console.error(updateErr.message);
        return res.status(400).json({ message: 'Error with updating tape', error: updateErr.message });
      }

      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Tape not found' });
      }

      return res.status(200).json({ message: 'Tape Updated', checkResult});

    });
    
  });
});
// Route to add new tapes to stock
router.post('/tapes', async (req, res) => {
  const { tapeName, tapeQuantity } = req.body; 

  try {
    // 1. Validate Input (Important! - Add more validation as needed)
    if (!tapeName || !tapeQuantity) {
      return res.status(400).json({ message: 'Tape name and quantity are required' });
    }

    // 2. Check if Tape Already Exists in Inventory
    const [existingTape] = await db.query('SELECT * FROM TapeInventory WHERE tapeName = ?', [tapeName]);

    if (existingTape.length > 0) {
      // If the tape exists, update the quantity
      const newQuantity = existingTape[0].tapeQuantity + parseInt(tapeQuantity, 10);
      const updateSql = 'UPDATE TapeInventory SET tapeQuantity = ? WHERE tapeName = ?';
      await db.query(updateSql, [newQuantity, tapeName]);
      return res.json({ message: `Tape quantity updated: ${tapeName} - Quantity: ${newQuantity}` });
    } else {
      // If the tape doesn't exist, insert a new record
      const insertSql = 'INSERT INTO TapeInventory (tapeName, tapeQuantity) VALUES (?, ?)';
      await db.query(insertSql, [tapeName, tapeQuantity]);
      return res.json({ message: 'New tape added to inventory successfully' });
    }
  } catch (err) {
    console.error('Error adding/updating tape inventory:', err);
    res.status(500).json({ message: 'Failed to add/update tape inventory' });
  }
});

// Route to get the list of tape names for the dropdown
router.get('/tape-names', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT tapeName FROM TapeInventory');
    const tapeNames = rows.map(row => row.tapeName);
    res.json(tapeNames);
  } catch (err) {
    console.error('Error fetching tape names:', err);
    res.status(500).json({ message: 'Failed to fetch tape names' });
  }
});

router.route('/tapestock').get((req, res) => {
  const sql = 'SELECT * FROM TapeInventory';
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err)
    };
    return res.json(data);
  });
});







//     let sql = 'SELECT * FROM Tape WHERE 1=1'; // Start with 'WHERE 1=1' for easy appending
//     const params = [];

//     if (tapeId) {
//       sql += ' AND tapeId = ?';
//       params.push(tapeId);
//     }
//     if (systemName) {
//       sql += ' AND sysName LIKE ?';
//       params.push(`%${systemName}%`);
//     }
//     if (applicationName) {
//       sql += ' AND subSysName LIKE ?';
//       params.push(`%${applicationName}%`);
//     }
//     if (backupStatus) {
//       sql += ' AND bStatus = ?';
//       params.push(backupStatus);
//     }
//     if (mediaType) {
//       sql += ' AND mType = ?';
//       params.push(mediaType);
//     }
//     if (tapeStatus) {
//       sql += ' AND tStatus = ?';
//       params.push(tapeStatus);
//     }
//     if (startDate) {
//       sql += ' AND sDate >= ?';
//       params.push(startDate);
//     }
//     if (endDate) {
//       sql += ' AND eDate <= ?';
//       params.push(endDate);
//     }
//     if (location) {
//       sql += ' AND lStatus = ?';
//       params.push(location);
//     }

//     const [results] = await db.query(sql, params);
//     res.json(results);
//   } catch (err) {
//     console.error('Error searching for tapes:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

export default router;