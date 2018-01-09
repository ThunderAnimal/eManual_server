const mongoose = require('mongoose');


const productsSchema = mongoose.Schema({
    productName: {type: String},
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    productImages: [String],
    profilePicture: String,
    productDescription:{type:String, requires: true},
    favorites: {type: Number, default: 0},
    productResources: [{
        description: {type: String},
        originalName: {type: String},
        dataType: String,
        url: {type: String, requires: true}
    }],
    productLinks: [{
        description: {type: String},
        url: {type: String, requires: true}
    }]
}, {

    timestamps: true,
    usePushEach: true

});

productsSchema.index({"createdAt": 1});
productsSchema.index({"updatedAt": 1});

//SEARCH INDEX for FULL TEXT
productsSchema.index(
    {
        "productName": "text",
        "productDescription": "text",
        "productResources.description": "text",
        "productResources.originalName": "text",
        "productLinks.description": "text"
    },
    {
        name: "product.search_index"
    },
    {
        "weights": {
            "productName": 10,
            "productDescription": 5,
            "productResources.description": 2,
            "productResources.originalName": 1,
            "productLinks.description": 2
        }
    }
);

module.exports = mongoose.model("product", productsSchema);