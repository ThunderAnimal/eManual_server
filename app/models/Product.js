//import
"use strict"

var mongoose=require('mongoose');

//category schema

var productsSchema = mongoose.Schema({
    productName: String,
    companyName: String,
    categories: [String],
    productImages: [String],
    productResources: [String]
});

module.exports = mongoose.model("product", productsSchema);
