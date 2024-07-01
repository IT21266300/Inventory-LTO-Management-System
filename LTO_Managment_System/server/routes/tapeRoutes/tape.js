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


// ========================================================================================

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



// delete tape
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


// Update Tape
router.route('/updateTape/:tapeId').put(async (req, res) => {
  const tapeId = req.params.tapeId;
  const { sysId, sysName, subSysName, bStatus, mType, tStatus, sDate, eDate, lStatus } = req.body;

  // Validate input data 
  if (!validateTapeInput(tapeId, sysId, sysName, subSysName, bStatus, mType, tStatus, sDate, eDate, lStatus)) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  // Sanitize input data
  const sanitizedInput = sanitizeTapeInput(tapeId, sysId, sysName, subSysName, bStatus, mType, tStatus, sDate, eDate, lStatus);

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
    db.query(updateSql, [
      sanitizedInput.sysName, 
      sanitizedInput.sysId, 
      sanitizedInput.subSysName, 
      sanitizedInput.bStatus, 
      sanitizedInput.mType, 
      sanitizedInput.tStatus, 
      sanitizedInput.sDate, 
      sanitizedInput.eDate, 
      sanitizedInput.lStatus, 
      tapeId
    ], (updateErr, updateResult) => {
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

// Update Tape Status
// router.route('/updateTapeStatus/:tapeId').put(async (req, res) => {
//   const tapeId = req.params.tapeId;
//   const { bStatus, tStatus, lStatus } = req.body;



//   // Sanitize input data
//   const sanitizedInput = sanitizeTapeInput(tapeId, null, null, null, bStatus, null, tStatus, null, null, lStatus);

//   // Check if the tape ID exists
//   const checkSql = 'SELECT * FROM Tape WHERE tapeId = ?';
//   db.query(checkSql, [tapeId], (checkErr, checkResult) => {
//     if (checkErr) {
//       console.error(checkErr.message);
//       return res.status(500).json({ message: 'Error with checking tape', error: checkErr.message });
//     }

//     if (checkResult.length === 0) {
//       return res.status(404).json({ message: 'Tape not found' });
//     }

//     // Update the tape status record
//     const updateSql = 'UPDATE Tape SET bStatus = ?, tStatus = ?, lStatus = ? WHERE tapeId = ?';
//     db.query(updateSql, [
//       sanitizedInput.bStatus,
//       sanitizedInput.tStatus,
//       sanitizedInput.lStatus,
//       tapeId
//     ], (updateErr, updateResult) => {
//       if (updateErr) {
//         console.error(updateErr.message);
//         return res.status(400).json({ message: 'Error with updating tape', error: updateErr.message });
//       }

//       if (updateResult.affectedRows === 0) {
//         return res.status(404).json({ message: 'Tape not found' });
//       }

//       return res.status(200).json({ message: 'Tape Updated' });
//     });
//   });
// });

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

// Tape Contents Management
router.route('/addTapeDetails').post(async (req, res) => {
  const { tapeId, date, remarks, tapeContent } = req.body;

  // Validate input data 
  if (!tapeId || !date || !remarks || !tapeContent) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  // Sanitize input data
  const sanitizedInput = {
    tapeId: tapeId.trim(),
    date,
    remarks: remarks.trim(),
    tapeContent: tapeContent.trim(),
  };

  // Insert the new tape detail
  const insertSql = 'INSERT INTO TapeDetails (tapeId, date, remarks, tapeContent) VALUES (?, ?, ?, ?)';
  db.query(insertSql, [
    sanitizedInput.tapeId, 
    sanitizedInput.date, 
    sanitizedInput.remarks, 
    sanitizedInput.tapeContent
  ], (err, result) => {
    if (err) return res.status(400).json({ message: err.message });
    return res.json({ message: 'New Tape details added..!' });
  });
});

router.route('/tapeContent/:tapeId').get(async (req, res) => {
  const { tapeId } = req.params;
  const sql = 'SELECT * FROM TapeDetails WHERE tapeId = ?';

  db.query(sql, [tapeId], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    if (data.length === 0) {
      return res.status(404).json({ message: 'Tape details not found..!' });
    }

    return res.json(data);
  });
});

router.route('/deleteTapeContent/:tapeId/:date').delete(async (req, res) => {
  const { tapeId, date } = req.params;

  const sql = 'DELETE FROM TapeDetails WHERE tapeId = ? AND date = ?';

  db.query(sql, [tapeId, date], (err, result) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send({ status: 'Error with deleting tape content', error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ status: 'Tape Content not found' });
    }

    return res.status(200).send({ status: 'Tape Content Deleted...!' });
  });
});

export default router;



// 1. Get all subsystems (from all systems)
// router.route('/subsystems').get(async (req, res) => {
//   const sql = 'SELECT * FROM subSystem';
//   db.query(sql, (err, data) => {
//     if (err) return res.json(err, "hello");
//     return res.json(data);
//   });
// });

// 2. Get a specific subsystem by subSysId
// router.route('/subsystems/:subSysId').get(async (req, res) => {
//   const { subSysId } = req.params;

//   try {
//     const sql = 'SELECT * FROM SubSystem WHERE subSysId = ?';
//     const [data] = await db.query(sql, [subSysId]);

//     if (data.length === 0) {
//       return res.status(404).json({ message: 'Subsystem not found' });
//     }

//     res.json(data[0]);
//   } catch (err) {
//     console.error('Error fetching subsystem:', err);
//     res.status(500).json({ message: 'Failed to fetch subsystem' });
//   }
// });
