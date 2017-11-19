//import
"use strict"

var mongoose=require('mongoose');

//category schema

var productsSchema = mongoose.Schema({
    productName: String,
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    productImages: [String],
    productResources: [String]
});

module.exports = mongoose.model("product", productsSchema);