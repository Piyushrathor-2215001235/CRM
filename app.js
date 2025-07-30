const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Route imports
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/customerRoutes');
const leadRoutes = require('./routes/leadRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const pipelineRoutes = require('./routes/pipelineRoutes');

// Middleware imports
const auth = require('./middleware/auth');
const userController = require('./controllers/userController'); // for login

dotenv.config();

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('method-override')('_method')); // Correctly require and use method-override

// View engine
app.set('view engine', 'ejs');

app.get('/test', (req, res) => {
  res.render('login');
});

// Static files
app.use(express.static('public'));

// --- Public Routes ---
app.get('/', (req, res) => res.render('login', { error: null }));
app.post('/login', userController.loginUser);
app.post('/logout', userController.logoutUser);

// --- Protected Routes ---
app.get('/dashboard', auth, (req, res) => res.render('dashboard', { user: req.user }));

app.use('/users', auth, userRoutes);
app.use('/customers', auth, customerRoutes);
app.use('/leads', auth, leadRoutes);
app.use('/campaigns', auth, campaignRoutes);
app.use('/pipelines', auth, pipelineRoutes);

// Authentication routes
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', userController.registerUser);

app.get('/forgot-password', (req, res) => {
  res.render('forgot-password');
});

app.post('/forgot-password', userController.forgotPassword);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
