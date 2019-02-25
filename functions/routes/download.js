'use strict';
// Dependencies
const express = require('express');
const router = express.Router();
const fs = require('fs');
const file = fs.createWriteStream('test.txt');


router.get('/:data/:dest', (req, res, next) => {
    const { data, dest } = req.params;
    file.write(data);

});

module.exports = router;
