const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const { encryptDocument, decryptDocument } = require('../utils/crypto');
const connection = require('../config/db');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// JWT Middleware
const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

// Save Document Route
router.post('/save', authenticateUser, upload.single('document'), async (req, res) => {
  const { keyword, format } = req.body;

  if (!req.file || !keyword || !format) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const { encryptedData: encryptedKeyword, iv: keywordIV } = encryptDocument(keyword);
  const keywordHash = crypto.createHash('sha256').update(keyword).digest('hex');

  let documentData, docIV = null;

  if (format === 'text') {
    const text = req.file.buffer.toString('utf-8');
    const { encryptedData, iv } = encryptDocument(text);
    documentData = Buffer.from(encryptedData, 'hex');
    docIV = iv;
  } else {
    documentData = req.file.buffer;
  }

  const sql = `
    INSERT INTO documents (user_id, keyword, keyword_hash, keyword_iv, document, iv, format)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await connection.promise().query(sql, [
      req.userId, encryptedKeyword, keywordHash, keywordIV, documentData, docIV, format
    ]);
    res.status(201).json({ message: 'Document saved', documentId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
});

// Verify/Search Document Route
router.post('/verify', authenticateUser, async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) return res.status(400).json({ message: 'Keyword is required' });

  const keywordHash = crypto.createHash('sha256').update(keyword).digest('hex');

  const sql = `
    SELECT * FROM documents WHERE user_id = ? AND keyword_hash = ?
    ORDER BY created_at DESC LIMIT 1
  `;

  try {
    const [rows] = await connection.promise().query(sql, [req.userId, keywordHash]);

    if (!rows.length) return res.status(404).json({ message: 'Document not found' });

    const doc = rows[0];

    if (doc.format === 'text') {
      const decrypted = decryptDocument(doc.document.toString('hex'), doc.iv);
      res.setHeader('Content-Type', 'text/plain');
      res.send(decrypted);
    } else {
      const mimeType = getMimeType(doc.format);
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="document.${doc.format.split('/')[1]}"`);
      res.send(doc.document);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Search error' });
  }
});

function getMimeType(format) {
  switch (format) {
    case 'application/pdf': return 'application/pdf';
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return 'application/msword';
    case 'image/jpeg': return 'image/jpeg';
    case 'image/png': return 'image/png';
    default: return 'application/octet-stream';
  }
}

module.exports = router;
