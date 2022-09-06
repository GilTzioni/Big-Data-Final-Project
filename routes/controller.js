const express = require('express');
const router = express.Router();


router.get('/', function(req, res, next) {//(URL || Path , Call back function)
  res.render('./pages/dashboard', {});
});

router.post('/landings', function(req, res) {
  res.render('./pages/landings');
});

router.post('/flights', function(req, res) {
  res.render('./pages/flights');
});

// where style files will be
router.use('/', express.static('./views'))

module.exports = router;