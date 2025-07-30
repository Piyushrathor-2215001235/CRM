const express = require('express');
const router = express.Router();
const pipelineController = require('../controllers/pipelineController');

router.get('/', pipelineController.listPipelines);
router.get('/new', pipelineController.getNewPipelineForm);
router.post('/', pipelineController.addPipeline);
router.get('/edit/:id', pipelineController.getEditPipelineForm);
router.put('/:id', pipelineController.updatePipeline);
router.delete('/:id', pipelineController.deletePipeline);

module.exports = router; 