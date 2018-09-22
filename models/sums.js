'use strict';

const mongoose = require('mongoose');

const sumsSchema = mongoose.Schema({
  heavenly: [{
    total: Number,
    wordSums: [{
      word: String,
      value: Number
    }],
    letterSums: [Number]
  }],
  earthly: [{
    total: Number,
    wordSums: [{
      word: String,
      value: Number
    }],
    letterSums: [Number]
  }]
});

sumsSchema.set('toObject', {
  transform: function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Sums', sumsSchema);