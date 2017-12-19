"use strict";

var mongoose = require("mongoose");

var companySchema = mongoose.Schema({
    login:{type:String,unique:true,requires:true},
    password:{type:String,requires:true},
    name:{type: String,requires:true},
    isConsumerOptIn: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consumer'
    }],
    serviceProvider_id:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceProvider'
    }]
});

module.exports = mongoose.model("Company", companySchema);