var authManager = require("./authManager");

exports.getOne = function(req, res, next) {
    next(new Error('not implemented'));
};

exports.getAll = function(req, res, next){
    next(new Error('not implemented'));
};

exports.create = function(req, res, next){
    const companyId = authManager.getCompanyId(req.user);

    console.log(companyId);
    console.log(req.files);
    console.log(req.body);
    //TODO Create new Product in MongoDB with the Data

    return res.status(201).send({ok: true});

    //next(new Error('not implemented'));
};

exports.update = function(req, res, next){
    next(new Error('not implemented'));
};

exports.delete = function (req, res, next){
    next(new Error('not implemented'));
};