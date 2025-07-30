const Customer = require('../models/Customer');
const User = require('../models/User');

// Display list of all customers
exports.listCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().populate('assignedTo', 'name');
        res.render('customers/index', { customers });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Display form for creating a new customer
exports.getNewCustomerForm = async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ['Admin', 'SalesRep'] } });
        res.render('customers/new', { users });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Handle new customer creation
exports.addCustomer = async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.redirect('/customers');
    } catch (err) {
        const users = await User.find({ role: { $in: ['Admin', 'SalesRep'] } });
        res.render('customers/new', { error: err.message, users });
    }
};

// Display form for editing a customer
exports.getEditCustomerForm = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        const users = await User.find({ role: { $in: ['Admin', 'SalesRep'] } });
        res.render('customers/edit', { customer, users });
    } catch (err) {
        res.status(404).send('Customer not found');
    }
};

// Handle customer update
exports.updateCustomer = async (req, res) => {
    try {
        await Customer.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/customers');
    } catch (err) {
        const customer = await Customer.findById(req.params.id);
        const users = await User.find({ role: { $in: ['Admin', 'SalesRep'] } });
        res.render('customers/edit', { error: err.message, customer, users });
    }
};

// Handle customer deletion
exports.deleteCustomer = async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.redirect('/customers');
    } catch (err) {
        res.status(500).send(err.message);
    }
}; 