import express from 'express';
import Staff from '../../models/tapeModels/tapeCategory';
import bcrypt from 'bcryptjs';
import multer from 'multer';

const router = express.Router();

router.route('/add').post(async (req, res) => {
  
  
  const subSystemName = req.body.name;
  const phone = req.body.phone;
  const position = req.body.position;
  const password = bcrypt.hashSync(req.body.password);


  const existingUser = await Staff.findOne({
    $or: [{ staffId }],
  });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: 'Username or staffID already in use' });
  }

  const newStaff = new Staff({
    staffId,
    name,
    phone,
    position,
    password,
  });

  newStaff
    .save()
    .then(() => {
      res.json('Staff Added');
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
});


router.route('/').get((req, res) => {
  Staff.find()
    .then((staff) => {
      res.json(staff);
    })
    .catch((err) => {
      console.log(err);
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

router.route('/delete/:staffId').delete(async (req, res) => {
  let userId = req.params.staffId;

  await Staff.findByIdAndDelete({ _id: userId })
    .then(() => {
      res.status(200).send({ status: 'User Deleted' });
    })
    .catch((err) => {
      console.log(err.message);
      res
        .status(500)
        .send({ status: 'Error with deleting user', error: err.message });
    });
});

router.route('/get/:staffId').get(async (req, res) => {
  let userId = req.params.staffId;
  const staff = await Staff.findOne({ staffId: userId })
    .then((staff) => {
      res.status(200).send({ status: 'User fetched', staff: staff });
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// module.exports=router;
export default router;
