import express from 'express';
import Staff from '../../models/staffModels/staff.js';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import db from '../../dbConnection.js';

const router = express.Router();

router.route('/').get((req, res) => {
  const sql = 'SELECT * FROM Staff';
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// router.route('/get/:staffId').get(async (req, res) => {
//   let userId = req.params.staffId;
//   const staff = await Staff.findOne({ staffId: userId })
//     .then((staff) => {
//       res.status(200).send({ status: 'User fetched', staff: staff });
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// });

// module.exports=router;
export default router;
