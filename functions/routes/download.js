'use strict';
// Dependencies
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    // const { text, name } = req.body;
    res.attachment(`test.txt`);
    res.type('txt');
    res.send('this is a test');
})

module.exports = router;