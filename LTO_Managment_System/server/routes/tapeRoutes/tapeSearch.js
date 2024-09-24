import express from 'express';
import db from '../../dbConnection.js'; // Assuming you have a database connection established

const router = express.Router();

router.post('/tapesearch/search', async (req, res) => {
  console.log('Search route hit!');
  try {
    const {
      tapeId,
      systemName,
      subSysName,
      dayoftheweek,
      backupStatus,
      mediaType,
      tapeStatus,
      startDate,
      endDate,
      location,
      special,
    } = req.body;

    // Start with the base query and add filters dynamically
    let sql = 'SELECT * FROM Tape WHERE 1=1';
    const params = [];

    // Dynamically add conditions based on provided values
    if (tapeId) {
      sql += ' AND tapeId = ?';
      params.push(tapeId);
    }
    if (systemName) {
      sql += ' AND sysName = ?';
      params.push(systemName);
    }
    if (subSysName) {
      sql += ' AND subSysName = ?';
      params.push(subSysName);
    }
    if (dayoftheweek) {
      sql += ' AND dayoftheweek = ?';
      params.push(dayoftheweek);
    }
    if (backupStatus) {
      sql += ' AND bStatus = ?';
      params.push(backupStatus);
    }
    if (mediaType) {
      sql += ' AND mType = ?';
      params.push(mediaType);
    }
    if (tapeStatus) {
      sql += ' AND tStatus = ?';
      params.push(tapeStatus);
    }
    if (startDate) {
      sql += ' AND sDate >= ?'; // Assuming you're searching tapes with sDate after or on the startDate
      params.push(startDate);
    }
    if (endDate) {
      sql += ' AND eDate >= ?'; // Assuming you're searching tapes with eDate before or on the endDate
      params.push(endDate);
    } 
    if (location) {
      sql += ' AND lStatus = ?';
      params.push(location);
    }
    if (special) {
      sql += ' AND sStatus = ?';
      params.push(special);
    }

    db.query(sql, params, (err, data) => {
      if (err) return res.status(500).json({ error: err.message });

      if (data.length === 0) {
        return res.status(404).json({ message: 'No tapes found with the provided criteria.' });
      }

      return res.json(data);
    });

  } catch (error) {
    console.error('Error during tape search:', error);
    res.status(500).json({ error: 'Failed to search tapes' });
  }
});

// Optional: A get route for a single tape by tapeId (if needed)
router.get('/tapesearch/:tapeId', async (req, res) => {
  const { tapeId } = req.params;
  const sql = 'SELECT * FROM TapeDetails WHERE tapeId = ?';

  db.query(sql, [tapeId], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    if (data.length === 0) {
      return res.status(404).json({ message: 'Tape not found.' });
    }

    return res.json(data);
  });
});

export default router;
