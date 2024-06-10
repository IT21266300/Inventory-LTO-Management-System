import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import { generateToken } from '../../utils.js';
import db from '../../dbConnection.js';

const signRouter = express.Router();

signRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const { staffId, password } = req.body;
    const sql = 'SELECT * FROM Staff WHERE staffId = ?';
    
    db.query(sql, [staffId], (err, results) => {
        if (err) return res.status(500).json(err);
        
        const member = results[0];
        
        if (member) {
            if (bcrypt.compareSync(password, member.password)) {
                res.send({
                    id: member.id,
                    name: member.name,
                    staffId: member.staffId,
                    position: member.position,
                    phone: member.phone,
                    password: member.password,
                    token: generateToken(member)
                });
                return;
            }
        }
        res.status(401).send({ message: 'Invalid staffId or password' });
    });
}));

export default signRouter;
