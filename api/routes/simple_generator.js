const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.send({results: ['Server response 1', 'Server Response 2']});
});

module.exports = router;
