const Pipeline = require('../models/Pipeline');
const User = require('../models/User');
const Lead = require('../models/Lead');

// Display list of all pipelines
exports.listPipelines = async (req, res) => {
    try {
        const pipelines = await Pipeline.find().populate('owner', 'name').populate('leads');
        res.render('pipelines/index', { pipelines });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Display form for creating a new pipeline
exports.getNewPipelineForm = async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ['Admin', 'SalesRep'] } });
        const leads = await Lead.find();
        res.render('pipelines/new', { users, leads });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Handle new pipeline creation  
exports.addPipeline = async (req, res) => {
    try {
        // Convert stages from comma-separated string to array if needed
        let stages = req.body.stages;
        if (typeof stages === 'string') {
            stages = stages.split(',').map(s => s.trim()).filter(Boolean);
        }
        // Ensure leads is always an array
        let leads = req.body.leads;
        if (!leads) {
            leads = [];
        } else if (!Array.isArray(leads)) {
            leads = [leads];
        }
        const pipeline = new Pipeline({
            name: req.body.name,
            stages,
            leads,
            owner: req.body.owner
        });
        await pipeline.save();
        res.redirect('/pipelines');
    } catch (err) {
        const users = await User.find({ role: { $in: ['Admin', 'SalesRep'] } });
        const leads = await Lead.find();
        res.render('pipelines/new', { error: err.message, users, leads });
    }
};

// Display form for editing a pipeline
exports.getEditPipelineForm = async (req, res) => {
    try {
        const pipeline = await Pipeline.findById(req.params.id);
        const users = await User.find({ role: { $in: ['Admin', 'SalesRep'] } });
        const leads = await Lead.find();
        res.render('pipelines/edit', { pipeline, users, leads });
    } catch (err) {
        res.status(404).send('Pipeline not found');
    }
};

// Handle pipeline update
exports.updatePipeline = async (req, res) => {
    try {
        // Convert stages from comma-separated string to array if needed
        let stages = req.body.stages;
        if (typeof stages === 'string') {
            stages = stages.split(',').map(s => s.trim()).filter(Boolean);
        }
        // Ensure leads is always an array
        let leads = req.body.leads;
        if (!leads) {
            leads = [];
        } else if (!Array.isArray(leads)) {
            leads = [leads];
        }
        await Pipeline.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            stages,
            leads,
            owner: req.body.owner
        });
        res.redirect('/pipelines');
    } catch (err) {
        const pipeline = await Pipeline.findById(req.params.id);
        const users = await User.find({ role: { $in: ['Admin', 'SalesRep'] } });
        const leads = await Lead.find();
        res.render('pipelines/edit', { error: err.message, pipeline, users, leads });
    }
};

// Handle pipeline deletion
exports.deletePipeline = async (req, res) => {
    try {
        await Pipeline.findByIdAndDelete(req.params.id);
        res.redirect('/pipelines');
    } catch (err) {
        res.status(500).send(err.message);
    }
};