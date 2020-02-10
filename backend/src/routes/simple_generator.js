const express = require('express');
const router = express.Router();

router.post('/', function(req, res, next) {
  switch (req.body.argument) {
    case "": res.send({results: "You didn't supply a body"}); break;
    case "a": res.send({results: "You supplied Table 1"}); break;
    case "b": res.send({results: "You supplied Table 2"}); break;
    default: res.send({results: "You clearly aren't using the UI"}); break;
  }
});

module.exports = router;
