const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/', customerController.listCustomers);
router.get('/new', customerController.getNewCustomerForm);
router.post('/', customerController.addCustomer);
router.get('/edit/:id', customerController.getEditCustomerForm);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router; 