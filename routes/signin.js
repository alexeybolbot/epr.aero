const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

router.post('/', UserController.signin);
router.post('/new_token', UserController.newToken);

module.exports = router;
