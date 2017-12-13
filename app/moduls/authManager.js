var jwt = require('jsonwebtoken');
var config = require("config");

var Company = require('../models/Company');
var Representative = require('../models/Representative');
var Consumer = require('../models/Consumer');
var ServiceProvider = require('../models/ServiceProvider');

exports.findUser = function(email, done){
    var findCompany = function(email, done){
        Company.findOne({login: email}, function (err, result) {
            if(err){
                console.log(err);
                done(null);
            }else{
                done(result);
            }
        });
    };
    var findRepresentative = function(email, done){
        Representative.findOne({login: email}, function (err, result) {
            if(err){
                console.log(err);
                done(null);
            }else{
                done(result);
            }
        });
    };
    var findConsumer = function(email, done){
        Consumer.findOne({email: email}, function (err, result) {
            if(err){
                console.log(err);
                done(null);
            }else{
                done(result);
            }
        });
    };

    var findServiceProvider = function(email, done){
        ServiceProvider.findOne({login: email}, function (err, result) {
            if(err){
                console.log(err);
                done(null);
            }else{
                done(result);
            }
        });
    };

    findCompany(email, function(result){
        if(result){
            done(result);
        }else{
            findRepresentative(email, function(result){
                if(result){
                    done(result);
                }else{
                    findConsumer(email, function(result){
                        if(result){
                            done(result);
                        }else{
                            findServiceProvider(email, function(result){
                                if(result){
                                    done(result);
                                }else{
                                    done(null);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.checkPassword = function(user, password){
    if (user instanceof Company) {
        return user.password === password;
    }else if (user instanceof Representative){
        return user.password === password;
    }else if (user instanceof Consumer){
        return user.password === password;
    }else if (user instanceof ServiceProvider){
        return user.password === password;
    }
    return false;
};

exports.loginUser = function (user) {
    var userJSON = user.toObject();

    if(user instanceof Company){
        userJSON.model = Company.collection.collectionName;
    }else if(user instanceof Representative){
        userJSON.model = Representative.collection.collectionName;
    }else if(user instanceof Consumer){
        userJSON.model = Consumer.collection.collectionName;
    }else if(user instanceof ServiceProvider){
        userJSON.model = ServiceProvider.collection.collectionName;
    }else{
        var err = new Error('Model not Found');
        console.log(err);
    }
    userJSON.login_at = Date.now();
    return userJSON;
};

exports.generateJWT = function (user){
    return jwt.sign({
        _id: user._id,
        model: user.model,
        login_at: user.login_at
    }, config.server.secret, { expiresIn: '7d' });

};

exports.verifyUser = function(id, model, login_at, done){
    var findCompany = function(id, done){
        Company.findOne({_id: id}, function (err, result) {
            if(err){
                console.log(err);
                done(null);
            }else{
                done(result);
            }
        });
    };
    var findRepresentative = function(id, done){
        Representative.findOne({_id: id}, function (err, result) {
            if(err){
                console.log(err);
                done(null);
            }else{
                done(result);
            }
        });
    };

    var findConsumer = function(id, done){
        Consumer.findOne({_id: id}, function (err, result) {
            if(err){
                console.log(err);
                done(null);
            }else{
                done(result);
            }
        });
    };

    var findServiceProvider = function(id, done){
        ServiceProvider.findOne({_id: id}, function (err, result) {
            if(err){
                console.log(err);
                done(null);
            }else{
                console.log(result);
                done(result);
            }
        });
    };

    var setupUser = function(user){
        if(!user)
            return done(null);

        var userJSON = user.toObject();
        userJSON.model = model;
        userJSON.login_at = login_at;

        return done(userJSON);

    };
    if(model === Company.collection.collectionName){
        findCompany(id, setupUser);
    }else if(model === Representative.collection.collectionName){
        findRepresentative(id, setupUser);
    }else if(model === Consumer.collection.collectionName){
        findConsumer(id, setupUser);
    }else if(model === ServiceProvider.collection.collectionName){
        findServiceProvider(id, setupUser);
    }else{
        var err = new Error('Model not Found');
        console.log(err);
        done(null)
    }
};

exports.getCompanyId = function(user){
    if(this.isUserCompany(user)){
        return user._id;
    }else if(this.isUserRepresentative(user)){
        return user.company;
    }else{
        return null;
    }
};

exports.isUserCompany = function(user){
    if(!user)
        return false;

    return user.model === Company.collection.collectionName;
};
exports.isUserRepresentative = function(user){
    if(!user)
        return false;

    return user.model === Representative.collection.collectionName;
};
exports.isUserConsumer= function(user){
    if(!user)
        return false;

    return user.model === Consumer.collection.collectionName;
};
exports.isUserServiceProvider = function(user){
    if(!user)
        return false;

    return user.model === ServiceProvider.collection.collectionName;
};