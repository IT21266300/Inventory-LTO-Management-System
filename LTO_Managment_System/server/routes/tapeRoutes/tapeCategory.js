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

    // Insert the new staff member
    const insertSql = 'INSERT INTO Systems (sysName) VALUES (?)';
    db.query(insertSql, [sysName], (err, result) => {
      if (err) return res.status(400).json({ message: err.message });
      return res.json({ message: 'Staff Added' });
    });
  });
});

router.route('/').get((req, res) => {
  const sql = 'SELECT * FROM Systems';
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
router.route('/subsystems').get(async (req, res) => {
  try {
    const sql = 'SELECT * FROM SubSystem';
    const [data] = await db.query(sql);
    res.json(data);
  } catch (err) {
    console.error('Error fetching subsystems:', err);
    res.status(500).json({ message: 'Failed to fetch subsystems' });
  }
});

// 2. Get a specific subsystem by subSysId
router.route('/subsystems/:subSysId').get(async (req, res) => {
  const { subSysId } = req.params;

  try {
    const sql = 'SELECT * FROM SubSystem WHERE subSysId = ?';
    const [data] = await db.query(sql, [subSysId]);

    if (data.length === 0) {
      return res.status(404).json({ message: 'Subsystem not found' });
    }

    res.json(data[0]);
  } catch (err) {
    console.error('Error fetching subsystem:', err);
    res.status(500).json({ message: 'Failed to fetch subsystem' });
  }
});

// 3. Get all subsystems belonging to a specific system (using systemId)
router.route('/systems/:systemId/subsystems').get(async (req, res) => {
  const { systemId } = req.params;

  try {
    const sql = 'SELECT * FROM SubSystem WHERE parentSystemId = ?';
    const [data] = await db.query(sql, [systemId]);
    res.json(data);
  } catch (err) {
    console.error('Error fetching subsystems for system:', err);
    res.status(500).json({ message: 'Failed to fetch subsystems for system' });
  }
});

//add new subsystem to the system

router.route('/addSubSystem').post(async (req, res) => {
  const { subSysName, parentSystemId } = req.body;

  try {
    // 1. Validate Input: (Important! - Add more validation as needed)
    if (!subSysName || !parentSystemId) {
      return res
        .status(400)
        .json({ message: 'Subsystem name and parent system ID are required' });
    }

    // 2. Check if Subsystem Name Already Exists within the Parent System:
    const [existingSubSystem] = await db.query(
      'SELECT * FROM SubSystem WHERE subSysName = ? AND parentSystemId = ?',
      [subSysName, parentSystemId]
    );
    if (existingSubSystem.length > 0) {
      return res
        .status(409)
        .json({ message: 'Subsystem name already exists within this system' });
    }

    // 3. Insert the New Subsystem:
    const [result] = await db.query(
      'INSERT INTO SubSystem (subSysName, parentSystemId) VALUES (?, ?)',
      [subSysName, parentSystemId]
    );

    res.json({
      message: 'Subsystem added successfully',
      insertedId: result.insertId,
    });
  } catch (err) {
    console.error('Error adding subsystem:', err);
    res.status(500).json({ message: 'Failed to add subsystem' });
  }
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

  try {
    const sql = 'DELETE FROM SubSystem WHERE subSysId = ?';
    const [result] = await db.query(sql, [subSysId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Subsystem not found' });
    }

    res.json({ message: 'Subsystem deleted successfully' });
  } catch (err) {
    console.error('Error deleting subsystem:', err);
    res.status(500).json({ message: 'Failed to delete subsystem' });
  }
});

//update system

// router.route('/updateSystem/:systemId').put(async (req, res) => {
//   const systemId = req.params.systemId;
//   const { sysName } = req.body;

//   try {
//     // 1. Check if a system with the same name already exists
//     const [existingSystem] = await db.query(
//       'SELECT * FROM System WHERE sysName = ? AND sysId != ?',
//       [sysName, systemId]
//     );

//     if (existingSystem.length > 0) {
//       return res
//         .status(409)
//         .json({ message: 'System name already in use by another system' });
//     }

//     // 2. Update the System
//     const updateSql = 'UPDATE System SET sysName = ? WHERE sysId = ?';
//     const [updateResult] = await db.query(updateSql, [sysName, systemId]);

//     if (updateResult.affectedRows === 0) {
//       return res.status(404).json({ message: 'System not found' });
//     }

//     res.json({ message: 'System updated successfully' });
//   } catch (err) {
//     console.error('Error updating system:', err);
//     res.status(500).json({ message: 'Failed to update system' });
//   }
// });



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
        return res.status(400).json({ message: 'Error with updating user', error: updateErr.message });
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
  const { subSysId } = req.params;
  const { subSysName, parentSystemId } = req.body;

  try {
    // 1. Check for Existing Subsystem Name within the Same Parent System
    const [existingSubSystem] = await db.query(
      'SELECT * FROM SubSystem WHERE subSysName = ? AND subSysId != ? AND parentSystemId = ?',
      [subSysName, subSysId, parentSystemId] // Prevent checking against itself
    );

    if (existingSubSystem.length > 0) {
      return res
        .status(409)
        .json({
          message: 'Subsystem name already exists within this parent system',
        });
    }

    // 2. Update the Subsystem
    const updateSql =
      'UPDATE SubSystem SET subSysName = ?, parentSystemId = ? WHERE subSysId = ?';
    const [updateResult] = await db.query(updateSql, [
      subSysName,
      parentSystemId,
      subSysId,
    ]);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Subsystem not found' });
    }

    res.json({ message: 'Subsystem updated successfully' });
  } catch (err) {
    console.error('Error updating subsystem:', err);
    res.status(500).json({ message: 'Failed to update subsystem' });
  }
});

export default router;
