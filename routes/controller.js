const express = require('express');
const router = express.Router();
module.exports = router;

router.get('/', function(req, res, next) {//(URL || Path , Call back function)
  var numLanding = 14;
  var numFlight = 10;
  res.render('./pages/dashboard', {numLanding: numLanding , numFlight:numFlight });
});

// where style files will be
router.use('/', express.static('./views'))

