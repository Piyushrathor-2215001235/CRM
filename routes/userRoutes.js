const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// These routes are now protected and assume auth middleware is applied in app.js
router.get('/', userController.listUsers);
router.get('/new', userController.getNewUserForm);
router.post('/', userController.addUser);
router.get('/edit/:id', userController.getEditUserForm);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Registration and forgot password routes
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', userController.registerUser);

router.get('/forgot-password', (req, res) => {
  res.render('forgot-password');
});

router.post('/forgot-password', userController.forgotPassword);

module.exports = router; 