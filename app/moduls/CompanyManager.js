const companyModel = require("../models/Company");


exports.getOne = function(req, res) {
    companyModel.findOne({_id : req.params.id}, function(err, result) {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }else{
            res.status(200).send(result);
        }
    });
};


