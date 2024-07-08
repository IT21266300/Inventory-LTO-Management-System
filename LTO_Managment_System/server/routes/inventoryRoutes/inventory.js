import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import db from '../../dbConnection.js';

const router = express.Router();

router.route('/addSystem').post(async (req, res) => {
  const { sysName } = req.body;

  // Check if the staffId already exists
  const checkSql = 'SELECT * FROM Systems WHERE sysName = ?';
  db.query(checkSql, [sysName], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length > 0) {
      return res.status(409).json({ message: 'System name already in use' });
    }

    // Insert the new system
    const insertSql = 'INSERT INTO Systems (sysName) VALUES (?)';
    db.query(insertSql, [sysName], (err, result) => {
      if (err) return res.status(400).json({ message: err.message });
      return res.json({ message: 'New System add..!' });
    });
  });
});

router.route('/tapeStock').get((req, res) => {
  const sql = 'SELECT * FROM TapeInventory';
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

router.route('/:systemId').get(async (req, res) => {
  const { systemId } = req.params;
  const sql = 'SELECT * FROM Systems WHERE sysId = ?';

  db.query(sql, [systemId], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    if (data.length === 0) {
      return res.status(404).json({ message: 'System not found' });
    }

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

//add new subsystem to the system

router.route('/addSubSystem').post(async (req, res) => {
  const { subSysName, parentSystemId } = req.body;

  // Check if the staffId already exists
  const checkSql = 'SELECT * FROM SubSystem WHERE subSysName = ? AND parentSystemId = ?';
  db.query(checkSql, [subSysName, parentSystemId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length > 0) {
      return res.status(409).json({ message: 'Sub System name already in use...!' });
    }

    // Insert the new sub system
    const insertSql = 'INSERT INTO SubSystem (subSysName, parentSystemId) VALUES (?, ?)';
    db.query(insertSql, [subSysName, parentSystemId], (err, result) => {
      if (err) return res.status(400).json({ message: err.message });
      return res.json({ message: 'Sub System Added..!' });
    });
  });
});

// delete system
router.route('/delete/:systemId').delete(async (req, res) => {
  const { systemId } = req.params;

  const sql = 'DELETE FROM Systems WHERE sysId = ?';
  
  db.query(sql, [systemId], (err, result) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send({ status: 'Error with deleting system', error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ status: 'System not found' });
    }

    return res.status(200).send({ status: 'System Deleted' });
  });
});

// Route to delete a SubSystem
router.route('/deleteSubSystem/:subSysId').delete(async (req, res) => {
  const { subSysId } = req.params;

  const sql = 'DELETE FROM SubSystem WHERE subSysId = ?';
  
  db.query(sql, [subSysId], (err, result) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send({ status: 'Error with deleting system', error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ status: 'System not found' });
    }

    return res.status(200).send({ status: 'System Deleted' });
  });
});

//update system

router.route('/updateSystem/:systemId').put(async (req, res) => {
  const sysId = req.params.systemId;
  const { sysName } = req.body;

  // Check if the updated staffId already exists
  const checkSql = 'SELECT * FROM Systems WHERE sysId = ? AND sysName = ?';
  db.query(checkSql, [sysId, sysName], (checkErr, checkResult) => {
    if (checkErr) {
      console.error(checkErr.message);
      return res.status(500).json({ message: 'Error with checking system', error: checkErr.message });
    }

    if (checkResult.length > 0) {
      return res.status(409).json({ message: 'System name already in used' });
    }

    const updateSql = 'UPDATE Systems SET sysName = ? WHERE sysId = ?';
    db.query(updateSql, [sysName, sysId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error(updateErr.message);
        return res.status(400).json({ message: 'Error with updating system', error: updateErr.message });
      }

      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: 'System not found' });
      }

      return res.status(200).json({ message: 'System Updated' });
    });
  });
});

// update subsystem
router.route('/updateSubSystem/:subSysId').put(async (req, res) => {
  const sysId = req.params.subSysId;
  const { subSysName, parentSystemId } = req.body;

  // Check if the updated staffId already exists
  const checkSql = 'SELECT * FROM SubSystem WHERE subSysName = ? AND subSysId != ? AND parentSystemId = ?';
  db.query(checkSql, [subSysName, sysId, parentSystemId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error(checkErr.message);
      return res.status(500).json({ message: 'Error with checking system', error: checkErr.message });
    }

    if (checkResult.length > 0) {
      return res.status(409).json({ message: 'Sub System name already in used' });
    }

    const updateSql = 'UPDATE SubSystem SET subSysName = ?, parentSystemId = ? WHERE subSysId = ?';
    db.query(updateSql, [subSysName, parentSystemId ,sysId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error(updateErr.message);
        return res.status(400).json({ message: 'Error with updating system', error: updateErr.message });
      }

      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: 'System not found' });
      }

      return res.status(200).json({ message: 'System Updated' });
    });
  });
});

export default router;
