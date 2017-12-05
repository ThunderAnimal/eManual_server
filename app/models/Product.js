const mongoose=require('mongoose');


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
    productResources: [String]
},{

    timestamps: true

});

productsSchema.index({"createdAt": 1});
productsSchema.index({"updatedAt": 1});

module.exports = mongoose.model("product", productsSchema);