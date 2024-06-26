import express from 'express';
// import Staff from '../../models/staffModels/staff.js';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import db from '../../dbConnection.js';

const router = express.Router();


router.route('/addStaff').post(async (req, res) => {
  const { staffId, name, phone, position, password } = req.body;

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Check if the staffId already exists
  const checkSql = 'SELECT * FROM Staff WHERE staffId = ?';
  db.query(checkSql, [staffId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    
    if (results.length > 0) {
      return res.status(409).json({ message: 'Staff ID already in use' });
    }

    // Insert the new staff member
    const insertSql = 'INSERT INTO Staff (staffId, name, phone, position, password) VALUES (?, ?, ?, ?, ?)';
    db.query(insertSql, [staffId, name, phone, position, hashedPassword], (err, result) => {
      if (err) return res.status(400).json({ message: err.message });
      return res.json({ message: 'Staff Added' });
    });
  });
});

router.route('/').get((req, res) => {
  const sql = 'SELECT * FROM Staff';
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

router.route('/:staffId').get(async (req, res) => {
  const { staffId } = req.params; // Extract staffId from req.params
  const sql = 'SELECT * FROM Staff WHERE staffId = ?';

  db.query(sql, [staffId], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});


router.route('/delete/:staffId').delete(async (req, res) => {
  const { staffId } = req.params;

  const sql = 'DELETE FROM Staff WHERE staffId = ?';
  
  db.query(sql, [staffId], (err, result) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send({ status: 'Error with deleting user', error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ status: 'User not found' });
    }

    return res.status(200).send({ status: 'User Deleted' });
  });
});



router.route('/update/:staffId').put(async (req, res) => {
  let userId = req.params.staffId;
  const { staffId, name, phone, position } = req.body;

  const password = bcrypt.hashSync(req.body.password);

  const existingUser = await Staff.findOne({
    $or: [{ staffId }],
  });
  if (existingUser && existingUser.staffId != userId) {
    return res
      .status(409)
      .json({ message: 'Username or staffID already in use by another user' });
  }

  const updateStaff = {
    staffId,
    name,
    phone,
    position,
    password,
  };
  const update = await Staff.findOneAndUpdate({ staffId: userId }, updateStaff)
    .then(() => {
      res.status(200).send({ status: 'User Updated' });
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






// router.route('/update/:staffId').put(async (req, res) => {
//   const userId = req.params.staffId;
//   const { staffId, name, phone, position, password } = req.body;

//   if (!validateInput(staffId, name, phone, position, password)) {
//     return res.status(400).json({ message: 'Invalid input data' });
//   }

//   // Sanitize input data
//   const sanitizedInput = sanitizeInput(staffId, name, phone, position, password);

//   // Check if the updated staffId already exists
//   const checkSql = 'SELECT * FROM Staff WHERE staffId = ? AND staffId != ?';
//   db.query(checkSql, [sanitizedInput.staffId, userId], (checkErr, checkResult) => {
//     if (checkErr) {
//       console.error(checkErr.message);
//       return res.status(500).json({ message: 'Error with checking user', error: checkErr.message });
//     }

//     if (checkResult.length > 0) {
//       return res.status(409).json({ message: 'Username or staffID already in use by another user' });
//     }

//     // Hash the password if provided
//     const hashedPassword = password ? bcrypt.hashSync(sanitizedInput.password, 10) : null;

//     // Update the staff member
//     const updateSql = 'UPDATE Staff SET staffId = ?, name = ?, phone = ?, position = ?, password = ? WHERE staffId = ?';
//     db.query(updateSql, [sanitizedInput.staffId, sanitizedInput.name, sanitizedInput.phone, sanitizedInput.position, hashedPassword, userId], (updateErr, updateResult) => {
//       if (updateErr) {
//         console.error(updateErr.message);
//         return res.status(400).json({ message: 'Error with updating user', error: updateErr.message });
//       }

//       if (updateResult.affectedRows === 0) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       return res.status(200).json({ message: 'User Updated' });
//     });
//   });
// });
