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

router.route('/').get((req, res) => {
  const sql = 'SELECT * FROM System';
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

router.route('/:systemId').get(async (req, res) => {
  const { systemId } = req.params; // Extract staffId from req.params
  const sql = 'SELECT * FROM System WHERE systemId = ?';

  db.query(sql, [systemId], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});


router.route('/delete/:systemId').delete(async (req, res) => {
  const { systemId } = req.params;

  const sql = 'DELETE FROM System WHERE systemId = ?';
  
  db.query(sql, [staffId], (err, result) => {
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



router.route('/update/:systemId').put(async (req, res) => {
  let userId = req.params.staffId;
  const { sysId, sysName} = req.body;


  const existingUser = await System.findOne({
    $or: [{ systemId }],
  });
  if (existingSystem && existingSystem.systemId != systemId) {
    return res
      .status(409)
      .json({ message: 'System name already in use by another system' });
  }

  const updateSystem = {
    sysId,
    sysName
    
  };
  const update = await System.findOneAndUpdate({ systemId: systemId }, updateSystem)
    .then(() => {
      res.status(200).send({ status: 'System Updated' });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: err.message });
    });
});


router.route('/updateStaff/:staffId').put(async (req, res) => {
  const userId = req.params.staffId;
  const { staffId, name, phone, position, password } = req.body;

  // Check if the updated staffId already exists
  const checkSql = 'SELECT * FROM Staff WHERE staffId = ? AND staffId != ?';
  db.query(checkSql, [staffId, userId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error(checkErr.message);
      return res.status(500).json({ message: 'Error with checking user', error: checkErr.message });
    }

    if (checkResult.length > 0) {
      return res.status(409).json({ message: 'Username or staffID already in use by another user' });
    }

    // Hash the password if provided
    const hashedPassword = password ? bcrypt.hashSync(password, 10) : null;

    // Update the staff member
    const updateSql = 'UPDATE Staff SET staffId = ?, name = ?, phone = ?, position = ?, password = ? WHERE staffId = ?';
    db.query(updateSql, [staffId, name, phone, position, hashedPassword, userId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error(updateErr.message);
        return res.status(400).json({ message: 'Error with updating user', error: updateErr.message });
      }

      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ message: 'User Updated' });
    });
  });
});


export default router;
