import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import { generateToken } from '../../utils.js';
import db from '../../dbConnection.js';

const signRouter = express.Router();

signRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const { staffId, password } = req.body;

    // Input validation
    if (!staffId || !password) {
        return res.status(400).send({ message: 'staffId and password are required' });
    }
    if (typeof staffId !== 'string' || typeof password !== 'string') {
        return res.status(400).send({ message: 'Invalid input types' });
    }

    // Input sanitization
    const sanitizedStaffId = staffId.trim(); 
    const sanitizedPassword = password.trim();

    const sql = 'SELECT * FROM Staff WHERE staffId = ?';
    
    db.query(sql, [sanitizedStaffId], (err, results) => {
        if (err) {
            console.error(err.message); 
            return res.status(500).json({ message: 'Internal server error' }); 
        }
        
        const member = results[0];
        
        if (member) {
            if (bcrypt.compareSync(sanitizedPassword, member.password)) {
                // Don't send the password in the response!
                res.send({
                    id: member.id,
                    name: member.name,
                    staffId: member.staffId,
                    position: member.position,
                    phone: member.phone,
                    token: generateToken(member)
                });
                return;
            }
        }
        res.status(401).send({ message: 'Invalid staffId or password' });
    });
}));

export default signRouter;