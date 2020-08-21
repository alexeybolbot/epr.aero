const express = require('express');
const router = express.Router();
const createFolder = require('../middleware/createFolder');
const FileController = require('../controllers/file');

router.post('/upload', createFolder, FileController.upload);
router.get('/list', FileController.list);
router.delete('/delete/:id', FileController.delete);
router.get('/:id', FileController.get);
router.get('/download/:id', FileController.download);
router.put('/update/:id', FileController.update);

module.exports = router;
