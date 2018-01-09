const mongoose = require('mongoose');

//category schema
const categorySchema = mongoose.Schema({
    name: {type: String, unique: true, require: true}
}, {usePushEach: true});

//SEARCH INDEX for FULL TEXT
categorySchema.index({name: 'text'}, {name: "category.search_index"});

module.exports=mongoose.model("Category",categorySchema);
