var express = require('express');
var router = express.Router();

// All routes in this file are mounted at /api in app.js

// POST requests to /canopy accepts changes to the canopy configuration
router.post('/canopy', function(req, res, next) {
  console.log("New pattern!");
  // TODO: inspect req.body for the pattern configuration
  res.sendStatus(200);
});

module.exports = router;
