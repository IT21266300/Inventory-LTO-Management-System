import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import db from '../../dbConnection.js';

const router = express.Router();


router.route('/addSystem').post(async (req, res) => {
  const { sysId, sysName } = req.body;

 

  // Check if the systemName already exists
  const checkSql = 'SELECT * FROM System WHERE sysName = ?';
  db.query(checkSql, [sysName], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    
    if (results.length > 0) {
      return res.status(409).json({ message: 'System Name already in use' });
    }

    // Insert the new system
    const insertSql = 'INSERT INTO System (sysId, sysName) VALUES (?, ?, ?, ?, ?)';
    db.query(insertSql, [sysId, sysName], (err, result) => {
      if (err) return res.status(400).json({ message: err.message });
      return res.json({ message: 'System Added Successfully' });
    });
  });
});

// Get all systems
router.route('/systems').get(async (req, res) => { 
    try {
      const sql = 'SELECT * FROM System';
      const [data] = await db.query(sql); 
      res.json(data); 
    } catch (err) {
      console.error('Error fetching systems:', err);
      res.status(500).json({ message: 'Failed to fetch systems' }); 
    }
  });
  
  // Get a specific system by systemId
  router.route('/systems/:systemId').get(async (req, res) => {
    const { systemId } = req.params;
  
    try {
      const sql = 'SELECT * FROM System WHERE sysId = ?'; 
      const [data] = await db.query(sql, [systemId]); 
  
      if (data.length === 0) { 
        return res.status(404).json({ message: 'System not found' });
      }
  
      res.json(data[0]); 
    } catch (err) {
      console.error('Error fetching system:', err);
      res.status(500).json({ message: 'Failed to fetch system' }); 
    }
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
        return res.status(400).json({ message: 'Subsystem name and parent system ID are required' });
      }
  
      // 2. Check if Subsystem Name Already Exists within the Parent System:
      const [existingSubSystem] = await db.query(
        'SELECT * FROM SubSystem WHERE subSysName = ? AND parentSystemId = ?', 
        [subSysName, parentSystemId]
      );
      if (existingSubSystem.length > 0) {
        return res.status(409).json({ message: 'Subsystem name already exists within this system' });
      }
  
      // 3. Insert the New Subsystem:
      const [result] = await db.query(
        'INSERT INTO SubSystem (subSysName, parentSystemId) VALUES (?, ?)',
        [subSysName, parentSystemId]
      );
  
      res.json({ 
        message: 'Subsystem added successfully',
        insertedId: result.insertId 
      });
  
    } catch (err) {
      console.error('Error adding subsystem:', err);
      res.status(500).json({ message: 'Failed to add subsystem' });
    }
  });

// delete system

  router.route('/delete/:systemId').delete(async (req, res) => {
    const { systemId } = req.params;
  
    try {
      const sql = 'DELETE FROM System WHERE sysId = ?'; // Use sysId 
      const [result] = await db.query(sql, [systemId]); // Use systemId
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'System not found' }); 
      }
  
      res.json({ message: 'System deleted successfully' }); 
    } catch (err) {
      console.error('Error deleting system:', err);
      res.status(500).json({ message: 'Failed to delete system' }); 
    }
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

  router.route('/updateSystem/:systemId').put(async (req, res) => {
    const systemId = req.params.systemId;
    const { sysName } = req.body; 
  
    try {
      // 1. Check if a system with the same name already exists
      const [existingSystem] = await db.query(
        'SELECT * FROM System WHERE sysName = ? AND sysId != ?',
        [sysName, systemId]
      );
  
      if (existingSystem.length > 0) {
        return res.status(409).json({ message: 'System name already in use by another system' });
      }
  
      // 2. Update the System 
      const updateSql = 'UPDATE System SET sysName = ? WHERE sysId = ?';
      const [updateResult] = await db.query(updateSql, [sysName, systemId]);
  
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: 'System not found' });
      }
  
      res.json({ message: 'System updated successfully' }); 
  
    } catch (err) {
      console.error('Error updating system:', err);
      res.status(500).json({ message: 'Failed to update system' });
    }
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
        return res.status(409).json({ message: 'Subsystem name already exists within this parent system' });
      }
  
      // 2. Update the Subsystem 
      const updateSql = 'UPDATE SubSystem SET subSysName = ?, parentSystemId = ? WHERE subSysId = ?';
      const [updateResult] = await db.query(updateSql, [subSysName, parentSystemId, subSysId]);
  
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
