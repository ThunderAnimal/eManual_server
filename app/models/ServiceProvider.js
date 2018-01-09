var mongoose = require("mongoose");

var serviceProviderSchema = mongoose.Schema({
    login:{type:String,unique:true,requires:true},
    password:{type:String,requires:true},
    name:{type: String,requires:true},
    company_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }]
}, {usePushEach: true});

module.exports = mongoose.model("ServiceProvider", serviceProviderSchema);