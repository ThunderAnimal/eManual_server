"use strict"

var mongoose = require("mongoose");

var consumerSchema = mongoose.Schema({

    username: {
        type: String,
        requires: true
    },
    password: {
        type: String,
        requires: true
    },
    email: {
        type: String,
        unique: true,
        requires: true
    },
    spamAddress:{
        type: String
    },
    optin:  Boolean,
    image: {
        type: String
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]

}, {usePushEach: true});

module.exports = mongoose.model("Consumer", consumerSchema);