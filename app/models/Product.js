const mongoose = require('mongoose');


const productsSchema = mongoose.Schema({
    productName: {type: String, text:true},
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
    productDescription:{type:String},
    favorites: {type: Number, default: 0},
    productResources: [{
        description: {type: String, text:true},
        originalName: {type: String, text:true},
        dataType: String,
        url: {type: String, requires: true}
    }],
    productLinks: [{
        description: {type: String, text:true},
        url: {type: String, requires: true}
    }]
}, {

    timestamps: true

});

productsSchema.index({"createdAt": 1});
productsSchema.index({"updatedAt": 1});

//SEARCH INDEX for FULL TEXT
productsSchema.index({
    productName: 'text',
    'productResources.description': 'text',
    'productResources.originalName': 'text',
    'productLinks.description': 'text'
});

module.exports = mongoose.model("product", productsSchema);