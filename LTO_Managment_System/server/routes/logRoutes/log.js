import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import { generateToken } from '../../utils.js';
import db from '../../dbConnection.js';

const logRouter = express.Router();

logRouter.get('/log', expressAsyncHandler(async (req, res) => {
    const { id } = req.body;
    // const sql = 'SELECT * FROM Staff WHERE staffId = ?';
    
    db.query( [id], (err, results) => {
        if (err) return res.status(500).json(err);
        
        const log = results[0];
        
        if (log) {
            if (bcrypt.compareSync(id, log.id)) {
                res.send({
                    id: log.id,
                    level: log.level,
                    message: log.message,
                    timestamp: log.timestamp,
                    token: generateToken(log)
                });
                return;
            }
        }
        //res.status(401).send({ message: 'Invalid staffId or password' });
    });
}));

export default logRouter;
