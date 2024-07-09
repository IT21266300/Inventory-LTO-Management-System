import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import db from '../../dbConnection.js';

const router = express.Router();

// Function to validate input data 
function validateTapeInput(tapeId, sysId, sysName, subSysName, bStatus, mType, tStatus, sDate, eDate, lStatus) {
  if (!tapeId || !sysId || !sysName || !subSysName || !bStatus || !mType || !tStatus || !sDate || !eDate || !lStatus) {
    return false;
  }
  if (typeof tapeId !== 'string' || typeof sysId !== 'number' || typeof sysName !== 'string' || typeof subSysName !== 'string' || typeof bStatus !== 'string' || typeof mType !== 'string' || typeof tStatus !== 'string' || typeof sDate !== 'string' || typeof eDate !== 'string' || typeof lStatus !== 'string') {
    return false;
  }
  return true; 
}

// Function to sanitize input data
function sanitizeTapeInput(tapeId, sysId, sysName, subSysName, bStatus, mType, tStatus, sDate, eDate, lStatus) {
  return {
    tapeId: tapeId.trim(),
    sysId, 
    sysName: sysName.trim(),
    subSysName: subSysName.trim(),
    bStatus: bStatus.trim(),
    mType: mType.trim(),
    tStatus: tStatus.trim(),
    sDate,
    eDate,
    lStatus: lStatus.trim(),
  };
}

router.route('/addTape').post(async (req, res) => {
  const { tapeId, sysId, sysName, subSysName, bStatus, mType, tStatus, sDate, eDate, lStatus } = req.body;

  // Validate input data
  if (!validateTapeInput(tapeId, sysId, sysName, subSysName, bStatus, mType, tStatus, sDate, eDate, lStatus)) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  // Sanitize input data
  const sanitizedInput = sanitizeTapeInput(tapeId, sysId, sysName, subSysName, bStatus, mType, tStatus, sDate, eDate, lStatus);

  // Check if the tapeId already exists
  const checkSql = 'SELECT * FROM Tape WHERE tapeId = ?';
  db.query(checkSql, [sanitizedInput.tapeId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length > 0) {
      return res.status(409).json({ message: 'Tape ID already in use' });
    }

    // Insert the new tape
    const insertSql = 'INSERT INTO Tape (tapeId, sysId, sysName, subSysName, bStatus, mType, tStatus, sDate, eDate, lStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(insertSql, [
      sanitizedInput.tapeId,
      sanitizedInput.sysId,
      sanitizedInput.sysName,
      sanitizedInput.subSysName,
      sanitizedInput.bStatus,
      sanitizedInput.mType,
      sanitizedInput.tStatus,
      sanitizedInput.sDate,
      sanitizedInput.eDate,
      sanitizedInput.lStatus,
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
  const { sysId, sysName, subSysName, bStatus, mType, tStatus, sDate, eDate, lStatus } = req.body;

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
    const updateSql = 'UPDATE Tape SET sysName = ?, sysId = ?, subSysName = ?, bStatus = ?, mType = ?, tStatus = ?, sDate = ?, eDate = ?, lStatus = ? WHERE tapeId = ?';
    db.query(updateSql, [sysName, sysId, subSysName, bStatus, mType, tStatus, sDate, eDate, lStatus, tapeId], (updateErr, updateResult) => {
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
  const { bStatus, tStatus, lStatus } = req.body;

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
    const updateSql = 'UPDATE Tape SET bStatus = ?, tStatus = ?, lStatus = ? WHERE tapeId = ?';
    db.query(updateSql, [bStatus, tStatus, lStatus, tapeId], (updateErr, updateResult) => {
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



// 1. Get all subsystems (from all systems)
// router.route('/subsystems').get(async (req, res) => {
//   const sql = 'SELECT * FROM subSystem';
//   db.query(sql, (err, data) => {
//     if (err) return res.json(err, "hello");
//     return res.json(data);
//   });
// });


//     // Build your SQL query based on the search criteria 

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