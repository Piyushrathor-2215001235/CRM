const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

router.get('/', leadController.listLeads);
router.get('/new', leadController.getNewLeadForm);
router.post('/', leadController.addLead);
router.get('/edit/:id', leadController.getEditLeadForm);
router.put('/:id', leadController.updateLead);
router.delete('/:id', leadController.deleteLead);

module.exports = router; 