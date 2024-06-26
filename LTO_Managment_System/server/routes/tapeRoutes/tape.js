import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import db from '../../dbConnection.js';

const router = express.Router();

router.route('/addTape').post(async (req, res) => {
  const { tapeId, sysId, sysName, subSysName, bStatus, mType, tStatus, sDate, eDate, lStatus } = req.body;

  // Check if the tapeId already exists
  const checkSql = 'SELECT * FROM Tape WHERE tapeId = ?';
  db.query(checkSql, [tapeId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length > 0) {
      return res.status(409).json({ message: 'Tape ID already in use' });
    }

    // Insert the new tape
    const insertSql = 'INSERT INTO Tape (tapeId, sysId, sysName, subSysName, bStatus, mType, tStatus, sDate, eDate, lStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(insertSql, [tapeId, sysId, sysName, subSysName, bStatus, mType, tStatus, sDate, eDate, lStatus], (err, result) => {
      if (err) return res.status(400).json({ message: err.message });
      return res.json({ message: 'New Tape add..!' });
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
  const sql = 'SELECT * FROM tapedetails where tapeId = ?';

  db.query(sql, [tapeId], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    if (data.length === 0) {
      return res.status(404).json({ message: 'Sub System not found..!' });
    }

    return res.json(data);
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
