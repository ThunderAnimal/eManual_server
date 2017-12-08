const mongoose = require('mongoose');


const productsSchema = mongoose.Schema({
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
    profilePicture: String,
    productDescription:{type:String},
    favorites: {type: Number, default: 0},
    productResources: [{
        description: String,
        originalName: String,
        dataType: String,
        url: {type: String, requires: true}
    }],
    productLinks: [{
        description: String,
        url: {type: String, requires: true}
    }]
}, {

    timestamps: true

});

productsSchema.index({"createdAt": 1});
productsSchema.index({"updatedAt": 1});

module.exports = mongoose.model("product", productsSchema);