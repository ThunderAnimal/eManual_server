"use strict"

var mongoose = require("mongoose");

var companySchema = mongoose.Schema({
    login:{type:String,unique:true,requires:true},
    password:{type:String,requires:true},
    name:{type: String,requires:true}
});

module.exports = mongoose.model("Company", companySchema);