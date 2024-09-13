
const router = express.Router();
import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import db from '../../dbConnection.js';// Assuming you have a database connection established


router.post('/tapesearch/search', async (req, res) => {
  console.log('Search route hit!');
try {
  const {
    tapeId,
    systemName,
    subSysName,
    // applicationName,
    backupStatus,
    mediaType,
    tapeStatus,
    startDate,
    endDate,
    location,
    special,
  } = req.body;

  let sql = 'SELECT * FROM Tape WHERE tapeId = ? OR sysName = ? OR subSysName = ? OR bStatus = ? OR mType = ? OR tStatus = ? OR sDate = ? OR eDate = ? OR lStatus = ? OR sStatus = ?'; // Start with a base query

  db.query(sql, [tapeId, systemName, subSysName, backupStatus, mediaType, tapeStatus, startDate, endDate, location, special], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    if (data.length === 0) {
      return res.status(404).json({ message: 'Sub System not found..!' });
    }

    return res.json(data);
  });
  
} catch (error) {
  console.error('Error during tape search:', error);
  res.status(500).json({ error: 'Failed to search tapes' });
}
});


router.route('/tapesearch/search').get(async (req, res) => {
  const { tapeId } = req.params;
  const sql = 'SELECT * FROM TapeDetails where tapeId = ?';

  db.query(sql, [tapeId], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    if (data.length === 0) {
      return res.status(404).json({ message: 'Sub System not found..!' });
    }

    return res.json(data);
  });
});

export default router;