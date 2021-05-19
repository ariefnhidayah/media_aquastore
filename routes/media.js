var express = require('express');
var router = express.Router();

const MediaController = require('../controllers/MediaController')

router.get('/', MediaController.getAll)
router.post('/', MediaController.add)
router.delete('/:id', MediaController.delete)
router.post('/delete', MediaController.delete_by_image)

module.exports = router;
