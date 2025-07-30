const Lead = require('../models/Lead');
const User = require('../models/User');

// Display list of all leads
exports.listLeads = async (req, res) => {
    try {
        const leads = await Lead.find().populate('assignedTo', 'name');
        res.render('leads/index', { leads });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Display form for creating a new lead
exports.getNewLeadForm = async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ['Admin', 'SalesRep'] } });
        res.render('leads/new', { users });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Handle new lead creation
exports.addLead = async (req, res) => {
    try {
        const lead = new Lead(req.body);
        await lead.save();
        res.redirect('/leads');
    } catch (err) {
        const users = await User.find({ role: { $in: ['Admin', 'SalesRep'] } });
        res.render('leads/new', { error: err.message, users });
    }
};

// Display form for editing a lead
exports.getEditLeadForm = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        const users = await User.find({ role: { $in: ['Admin', 'SalesRep'] } });
        res.render('leads/edit', { lead, users });
    } catch (err) {
        res.status(404).send('Lead not found');
    }
};

// Handle lead update
exports.updateLead = async (req, res) => {
    try {
        await Lead.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/leads');
    } catch (err) {
        const lead = await Lead.findById(req.params.id);
        const users = await User.find({ role: { $in: ['Admin', 'SalesRep'] } });
        res.render('leads/edit', { error: err.message, lead, users });
    }
};

// Handle lead deletion
exports.deleteLead = async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);
        res.redirect('/leads');
    } catch (err) {
        res.status(500).send(err.message);
    }
}; 