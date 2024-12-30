import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import db from "../../dbConnection.js";

const router = express.Router();



router.route("/tapeStock").get((req, res) => {
  const sql = "SELECT * FROM TapeInventory";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

router.route("/tapeStock/:tapeType").get((req, res) => {
  const { tapeType } = req.params;
  const selectSql = "SELECT * FROM TapeInventory WHERE tapeName = ?";
  const updateSql =
    "UPDATE TapeInventory SET tapeQuantity  = tapeQuantity - 1 WHERE tapeName = ? AND tapeQuantity > 0";

  db.query(selectSql, [tapeType], (err, data) => {
    if (err) return res.json({ error: err.message });

    if (data.length === 0) {
      // If no tape found with the given type
      return res.json({ message: "Tape type not found" });
    }

    if (data[0].quantity <= 0) {
      // If the quantity is zero or less
      return res.json({ message: "Insufficient quantity" });
    }

    // Update the quantity
    db.query(updateSql, [tapeType], (updateErr) => {
      if (updateErr) return res.json({ error: updateErr.message });

      // Return the updated tape information
      db.query(selectSql, [tapeType], (finalErr, finalData) => {
        if (finalErr) return res.json({ error: finalErr.message });
        return res.json(finalData);
      });
    });
  });
});

// Route to add new tape stock
router.route('/addStock').post((req, res) => {
  const { tapeName, tapeQuantity,lastUpdate } = req.body;
  const insertSql = 'INSERT INTO TapeInventory (tapeName, tapeQuantity, lastUpdate) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE tapeQuantity = tapeQuantity + ?';

  db.query(insertSql, [tapeName, tapeQuantity, tapeQuantity, lastUpdate], (err, data) => {
    if (err) return res.json({ error: err.message });
    return res.json({ message: 'New stock added successfully', data });
  });
});

export default router;
