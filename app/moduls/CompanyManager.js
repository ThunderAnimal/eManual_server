const MODEL_PATH = '../models/';
const MODUL_PATH = '../moduls/';
const companyModel = require(MODEL_PATH + 'Company');
const productManager = require(MODUL_PATH + 'ProductManager');
const consumerManager = require(MODUL_PATH + 'ConsumerManager');


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


exports.changeCustomerOptIn = (product_id, user_id, bool, done) => {
    productManager.getCompanyIDbyProductID(product_id, (company_id) => {
        let companyID = company_id;
        companyModel.findOne({_id: company_id}, (err, data) => {
            if (err) {
                console.log("Error in finding company by companyID CompanyManager.js " + err)
            }
            else {
                if (bool) {
                    let flag = false;
                    for (let i = 0; i < data.isConsumerOptIn.length; i++) {
                        if (data.isConsumerOptIn[i].toString() === user_id.toString()) {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        data.isConsumerOptIn.push(user_id);
                        data.save();
                    }

                }
                else {
                    consumerManager.isNoMoreProductFromThatCompany(user_id, companyID, (isNoMore) => {
                        if (isNoMore){
                            data.isConsumerOptIn.splice(user_id);
                            data.save();
                        }
                    });
                }
                done();
            }
        });
    });
};

exports.listAllAuthorizedCompanies = (req, res) => {
    const serviceProviderID = req.user._id;
    // const serviceProviderID = "5a549057bf7c0110ec859597";
    let returnList = [];
    companyModel.find({}, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            for (let i=0; i<data.length; i++){
                for (let j=0; i<data[i].serviceProvider_id.length; j++){
                    if (serviceProviderID.toString() === data[i].serviceProvider_id[j].toString()){
                        returnList.push(data[i]._id);
                        break;
                    }
                }
            }
            res.send(returnList);
        }
    });
};