const mongoose = require('mongoose');

//category schema
const categorySchema = mongoose.Schema({
    name: {type: String, unique: true, require: true, text: true}
});

//SEARCH INDEX for FULL TEXT
categorySchema.index({name: 'text'});

module.exports=mongoose.model("Category",categorySchema);
