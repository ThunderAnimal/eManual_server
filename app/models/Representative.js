"use strict"

var mongoose = require("mongoose");

var representativeSchema = mongoose.Schema({
    login:{type:String,unique:true,requires:true},
    password:{type:String,requires:true},
    name:{type: String,requires:true},
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }
});

module.exports = mongoose.model("Representative",representativeSchema);