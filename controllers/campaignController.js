const Campaign = require('../models/Campaign');
const User = require('../models/User');
const Customer = require('../models/Customer');

// Display list of all campaigns
exports.listCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find().populate('createdBy', 'name');
        res.render('campaigns/index', { campaigns });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Display form for creating a new campaign
exports.getNewCampaignForm = async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ['Admin', 'CampaignManager'] } });
        const customers = await Customer.find();
        res.render('campaigns/new', { users, customers });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Handle new campaign creation
exports.addCampaign = async (req, res) => {
    try {
        const campaign = new Campaign(req.body);
        await campaign.save();
        res.redirect('/campaigns');
    } catch (err) {
        const users = await User.find({ role: { $in: ['Admin', 'CampaignManager'] } });
        const customers = await Customer.find();
        res.render('campaigns/new', { error: err.message, users, customers });
    }
};

// Display form for editing a campaign
exports.getEditCampaignForm = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        const users = await User.find({ role: { $in: ['Admin', 'CampaignManager'] } });
        const customers = await Customer.find();
        res.render('campaigns/edit', { campaign, users, customers });
    } catch (err) {
        res.status(404).send('Campaign not found');
    }
};

// Handle campaign update
exports.updateCampaign = async (req, res) => {
    try {
        await Campaign.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/campaigns');
    } catch (err) {
        const campaign = await Campaign.findById(req.params.id);
        const users = await User.find({ role: { $in: ['Admin', 'CampaignManager'] } });
        const customers = await Customer.find();
        res.render('campaigns/edit', { error: err.message, campaign, users, customers });
    }
};

// Handle campaign deletion
exports.deleteCampaign = async (req, res) => {
    try {
        await Campaign.findByIdAndDelete(req.params.id);
        res.redirect('/campaigns');
    } catch (err) {
        res.status(500).send(err.message);
    }
}; 