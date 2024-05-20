import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';

const signRouter = express.Router();

import Staff from '../../models/staffModels/staff.js';
import { generateToken } from '../../utils.js';


signRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const member = await Staff.findOne({staffId: req.body.staffId});
    if(member){
        if(bcrypt.compareSync(req.body.password, member.password)){
            res.send({
                mongoID: member._id,
                name: member.name,
                staffId: member.staffId,
                position: member.position,
                phone: member.phone,
                password: member.password,
                token: generateToken(member)
            })
            return;
        }
    }
    res.status(401).send({message: 'Invalid staffId or password'});
}))

export default signRouter;