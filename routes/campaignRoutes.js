const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');

router.get('/', campaignController.listCampaigns);
router.get('/new', campaignController.getNewCampaignForm);
router.post('/', campaignController.addCampaign);
router.get('/edit/:id', campaignController.getEditCampaignForm);
router.put('/:id', campaignController.updateCampaign);
router.delete('/:id', campaignController.deleteCampaign);

module.exports = router; 