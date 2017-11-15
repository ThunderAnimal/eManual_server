//import
"use strict"

var mongoose=require('mongoose');

//category schema

var categorySchema=mongoose.Schema({
    name:{ type:String, unique:true, require:true }
});

module.exports=mongoose.model("Category",categorySchema);
