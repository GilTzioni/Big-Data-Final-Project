var express = require('express');

var router = express.Router();
router.get('/flights', function(req, res, next) {
    var comments = [
        {author: "Adam", content: "I personally have never encountered a different opinion"},
        {author: "Ryan", content: "But what about Ligers? Are they good pets?"},
        {author: "Nick", content: "This woman is a genius!"}
    ];
   
    res.render('./pages/flights', {comments: comments});
  });
  module.exports = router;