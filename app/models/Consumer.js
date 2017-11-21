"use strict"

var mongoose = require("mongoose");

var consumerSchema = mongoose.Schema({

    username:{type: String,requires:true},
    password:{type:String,requires:true},
    email: {type: String,requires:true}

});

module.exports = mongoose.model("Consumer", consumerSchema);