const express = require('express');
const router = express.Router();


router.get('/', function(req, res, next) {//(URL || Path , Call back function)
  var numLanding = 14;
  var numFlight = 10;
  res.render('./pages/dashboard', {numLanding: numLanding , numFlight:numFlight });
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