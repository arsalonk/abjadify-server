'use strict';
// Dependencies
const express = require('express');
const router = express.Router();

// Models & Schemas
const Sums = require('../models/sums')
const { hValues, eValues, neutral } = require('../db/keys')

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

  let hSum, eSum = 0;
  let hWords, eWords = [];
  let hLetters, eLetters = [];
  let hSpaced, eSpaced = [];

  const splitString = input.trim().split('');
  splitString.forEach(letter => {
    if (hValues[letter]) {
      hSum += hValues[letter];
      eSum += eValues[letter];
      hLetters.push(hValues[letter]);
      eLetters.push(eValues[letter]);
      hSpaced.push(hValues[letter]);
      eSpaced.push(eValues[letter]);
    } else if (letter === ' ') {
      hLetters.push(' ');
      eLetters.push(' ');
      hSpaced.push(' ');
      eSpaced.push(' ');
    }
    hLetters = hLetters.join('');
    eLetters = eLetters.join('');
    hSpaced = hSpaced.join(' ');
    eSpaced = eSpaced.join(' ');
  });

  const splitStringSpaced = input.trim().split(' ');
  splitStringSpaced.forEach(word => {
    if (word !== '') {
      let currentHWord = {};
      let currentEWord = {};
      let hWordSum, eWordSum = 0;
      const splitWord = word.split('');
      splitWord.forEach(letter => {
        hWordSum += hValues[letter];
        eWordSum += eValues[letter];
      });
      currentHWord['key'] = word;
      currentHWord['value'] = hWordSum;
      currentEWord['key'] = word;
      currentEWord['value'] = eWordSum;
      hWords.push(currentHWord);
      eWords.push(currentEWord);
    }
  });

  const updateSums = {
    heavenly: {
      total: hSum,
      wordSums: hWords,
      letterSums: hLetters
    },
    earthly: {
      total: eSum,
      wordSums: eWords,
      letterSums: eLetters
    }
  };

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

  let hSum = 0;
  let eSum = 0;
  let hWords = [];
  let eWords = [];
  let hLetters = [];
  let eLetters = [];
  let hSpaced = [];
  let eSpaced = [];
  let letterCount = 0;
  let unused = neutral;

  const splitString = input.trim().split('');
  splitString.forEach(letter => {
    const index = unused.indexOf(letter);
    if (hValues[letter]) {
      letterCount += 1;
      hSum += hValues[letter];
      eSum += eValues[letter];
      hLetters.push(hValues[letter]);
      eLetters.push(eValues[letter]);
      hSpaced.push(hValues[letter]);
      eSpaced.push(eValues[letter]);
      if (index > -1) {
        unused = unused.splice(index, 1);
      }
    } else if (letter === ' ') {
      hLetters.push(' ');
      eLetters.push(' ');
      hSpaced.push(' ');
      eSpaced.push(' ');
    }
  });
  hLetters = hLetters.join('');
  eLetters = eLetters.join('');
  hSpaced = hSpaced.join(' ');
  eSpaced = eSpaced.join(' ');

  const splitStringSpaced = input.trim().split(' ');
  splitStringSpaced.forEach(word => {
    if (word !== '') {
      let currentHWord = {};
      let currentEWord = {};
      let hWordSum = 0;
      let eWordSum = 0;
      const splitWord = word.split('');
      splitWord.forEach(letter => {
        hWordSum += hValues[letter];
        eWordSum += eValues[letter];
      });
      currentHWord['word'] = word;
      currentHWord['value'] = hWordSum;
      currentEWord['word'] = word;
      currentEWord['value'] = eWordSum;
      hWords.push(currentHWord);
      eWords.push(currentEWord);
    }
  });

  console.log('unused:', unused, 'count:', letterCount)


  const newSum = {
    heavenly: {
      total: hSum,
      wordSums: hWords,
      letterSums: hLetters,
      spaced: hSpaced
    },
    earthly: {
      total: eSum,
      wordSums: eWords,
      letterSums: eLetters,
      spaced: eSpaced
    },
    general: {
      unused,
      letterCount
    }
  };

  Sums.create(newSum)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => next(err));
});

module.exports = router;
