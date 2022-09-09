const express = require('express');
const router = express.Router();


router.get('/', function(req, res, next) {//(URL || Path , Call back function)
  res.render('./pages/dashboard', {});
});

// where style files will be
router.use('/', express.static('./views'))

module.exports = router;