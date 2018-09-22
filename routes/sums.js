'use strict';
// Dependencies
const express = require('express');
const router = express.Router();

// Models & Schemas
const Sums = require('../models/sums')

// GET endpoint
router.get('/', (req, res, next) => {
  Sums.find()
    .then(result => {
      res.json(result);
    })
    .catch(err => next(err));
});

// PUT endpoint
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { input } = req.body;

  const updateSums = { input }

  Sums.findOneAndUpdate({ _id: id }, updateSums, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
  const { input } = req.body;
  console.log(input);
})

module.exports = router;
