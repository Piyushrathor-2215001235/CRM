const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Add a new user
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.redirect('/users');
  } catch (err) {
    res.status(400).render('users/new', { error: err.message });
  }
};

// Update an existing user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const updateData = { name, email, role };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    await User.findByIdAndUpdate(id, updateData);
    res.redirect('/users');
  } catch (err) {
    res.status(400).render('users/edit', { error: err.message, user: req.body });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.render('users/index', { users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNewUserForm = (req, res) => {
  res.render('users/new');
};

exports.getEditUserForm = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render('users/edit', { user });
  } catch (err) {
    res.status(404).send('User not found');
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).render('login', { error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).render('login', { error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).render('login', { error: err.message });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;
    
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.render('register', { error: 'Passwords do not match' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', { error: 'User with this email already exists' });
    }
    
    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    
    res.render('register', { success: 'Account created successfully! You can now login.' });
  } catch (err) {
    res.render('register', { error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.render('forgot-password', { error: 'No user found with this email address' });
    }
    
    // For now, we'll just show a success message
    // In a real application, you would send an email with a reset link
    res.render('forgot-password', { 
      success: 'If an account exists with this email, you will receive password reset instructions.' 
    });
  } catch (err) {
    res.render('forgot-password', { error: err.message });
  }
}; 