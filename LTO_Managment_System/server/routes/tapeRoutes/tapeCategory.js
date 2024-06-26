import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import db from '../../dbConnection.js';
import sanitize from 'sanitize-html'; // Add sanitize-html

const router = express.Router();

// ... (multer setup if needed)

// Add System
router.route('/addSystem').post(async (req, res) => {
  const { sysName } = req.body;

  // Input Validation and Sanitization
  const sanitizedSysName = sanitize(sysName, {
    allowedTags: [], // No HTML allowed in system names
    allowedAttributes: [],
  });

  // Check if the system name already exists
  const checkSql = 'SELECT * FROM Systems WHERE sysName = ?';
  db.query(checkSql, [sanitizedSysName], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length > 0) {
      return res.status(409).json({ message: 'System name already in use' });
    }

    // Insert the new system
    const insertSql = 'INSERT INTO Systems (sysName) VALUES (?)';
    db.query(insertSql, [sanitizedSysName], (err, result) => {
      if (err) return res.status(400).json({ message: err.message });
      return res.json({ message: 'New System added!' });
    });
  });
});

// Get All Systems
router.route('/').get((req, res) => {
  const sql = 'SELECT * FROM Systems';
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Get System by ID
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

// Get Subsystems for a System
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

// Add SubSystem
router.route('/addSubSystem').post(async (req, res) => {
  const { subSysName, parentSystemId } = req.body;

  // Input Validation and Sanitization
  const sanitizedSubSysName = sanitize(subSysName, {
    allowedTags: [], // No HTML allowed in sub system names
    allowedAttributes: [],
  });

  // Check if the sub system name already exists
  const checkSql = 'SELECT * FROM SubSystem WHERE subSysName = ? AND parentSystemId = ?';
  db.query(checkSql, [sanitizedSubSysName, parentSystemId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length > 0) {
      return res.status(409).json({ message: 'Sub System name already in use...!' });
    }

    // Insert the new sub system
    const insertSql = 'INSERT INTO SubSystem (subSysName, parentSystemId) VALUES (?, ?)';
    db.query(insertSql, [sanitizedSubSysName, parentSystemId], (err, result) => {
      if (err) return res.status(400).json({ message: err.message });
      return res.json({ message: 'Sub System Added..!' });
    });
  });
});

// Delete System
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

// Delete SubSystem
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

// Update System
router.route('/updateSystem/:systemId').put(async (req, res) => {
  const sysId = req.params.systemId;
  const { sysName } = req.body;

  // Input Validation and Sanitization
  const sanitizedSysName = sanitize(sysName, {
    allowedTags: [], // No HTML allowed in system names
    allowedAttributes: [],
  });

  // Check if the updated system name already exists
  const checkSql = 'SELECT * FROM Systems WHERE sysId = ? AND sysName = ?';
  db.query(checkSql, [sysId, sanitizedSysName], (checkErr, checkResult) => {
    if (checkErr) {
      console.error(checkErr.message);
      return res.status(500).json({ message: 'Error with checking system', error: checkErr.message });
    }

    if (checkResult.length > 0) {
      return res.status(409).json({ message: 'System name already in use' });
    }

    const updateSql = 'UPDATE Systems SET sysName = ? WHERE sysId = ?';
    db.query(updateSql, [sanitizedSysName, sysId], (updateErr, updateResult) => {
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

// Update SubSystem
router.route('/updateSubSystem/:subSysId').put(async (req, res) => {
  const subSysId = req.params.subSysId;
  const { subSysName, parentSystemId } = req.body;

  // Input Validation and Sanitization
  const sanitizedSubSysName = sanitize(subSysName, {
    allowedTags: [], // No HTML allowed in sub system names
    allowedAttributes: [],
  });

  // Check if the updated sub system name already exists
  const checkSql = 'SELECT * FROM SubSystem WHERE subSysName = ? AND subSysId != ? AND parentSystemId = ?';
  db.query(checkSql, [sanitizedSubSysName, subSysId, parentSystemId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error(checkErr.message);
      return res.status(500).json({ message: 'Error with checking system', error: checkErr.message });
    }

    if (checkResult.length > 0) {
      return res.status(409).json({ message: 'Sub System name already in use' });
    }

    const updateSql = 'UPDATE SubSystem SET subSysName = ?, parentSystemId = ? WHERE subSysId = ?';
    db.query(updateSql, [sanitizedSubSysName, parentSystemId, subSysId], (updateErr, updateResult) => {
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