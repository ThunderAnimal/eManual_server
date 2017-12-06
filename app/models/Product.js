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
    profilePicture:{type :String,requires:true },
    counter:{ type:Number,default:0 },
    productResources: [ {
         description:{ type:String,requires:true },
         originalName:{ type:String },
         dataType:{ type:String },
         originalLinks:{ type:String }
       }]
},{

    timestamps: true

});

productsSchema.index({"createdAt": 1});
productsSchema.index({"updatedAt": 1});

module.exports = mongoose.model("product", productsSchema);