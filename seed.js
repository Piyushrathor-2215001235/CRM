const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Customer = require('./models/Customer');
const Lead = require('./models/Lead');
const Campaign = require('./models/Campaign');
const Pipeline = require('./models/Pipeline');

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  // Clear existing data
  await User.deleteMany({});
  await Customer.deleteMany({});
  await Lead.deleteMany({});
  await Campaign.deleteMany({});
  await Pipeline.deleteMany({});

  // Create Users
  const password = await bcrypt.hash('password123', 10);
  const admin = await User.create({ name: 'Admin User', email: 'admin@crm.com', password, role: 'Admin' });
  const sales = await User.create({ name: 'Sales Rep', email: 'sales@crm.com', password, role: 'SalesRep' });
  const campaignMgr = await User.create({ name: 'Campaign Manager', email: 'campaign@crm.com', password, role: 'CampaignManager' });
  const customerUser = await User.create({ name: 'Customer User', email: 'customer@crm.com', password, role: 'Customer' });

  // Create Customers
  const customer = await Customer.create({
    name: 'Acme Corp',
    email: 'contact@acme.com',
    phone: '1234567890',
    company: 'Acme Corp',
    address: '123 Main St',
    assignedTo: sales._id,
    status: 'Active'
  });

  // Create Leads
  const lead = await Lead.create({
    name: 'John Doe',
    email: 'john@lead.com',
    phone: '9876543210',
    source: 'Website',
    status: 'New',
    assignedTo: sales._id,
    notes: 'Interested in product X.'
  });

  // Create Campaigns
  const campaign = await Campaign.create({
    name: 'Spring Sale',
    type: 'Email',
    targetAudience: [customer._id],
    startDate: new Date(),
    endDate: new Date(Date.now() + 7*24*60*60*1000),
    status: 'Scheduled',
    createdBy: campaignMgr._id,
    metrics: { openRate: 0, conversionRate: 0, reach: 0 }
  });

  // Create Pipelines
  const pipeline = await Pipeline.create({
    name: 'Default Sales Pipeline',
    stages: ['New', 'Contacted', 'Negotiated', 'Converted', 'Lost'],
    leads: [lead._id],
    owner: sales._id
  });

  console.log('Database seeded!');
  mongoose.disconnect();
}

seed(); 