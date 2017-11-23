"use strict"

var mongoose = require("mongoose");

var consumerSchema = mongoose.Schema({

    username:{type: String,unique:true,requires:true},
    password:{type:String,requires:true},
    email: {type: String,unique:true,requires:true}

});

module.exports = mongoose.model("Consumer", consumerSchema);