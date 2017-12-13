const config = require("config");
const nodemailer = require('nodemailer');

const utils = require("./utils");

const companyModel = require('../models/Company');
const consumerModel = require('../models/Consumer');

let messages = [];
let isQueueMails = false;
let transporter = undefined;

const queueMails = function(){
    isQueueMails = true;

    if(messages.length <= 0){
        isQueueMails = false;
        return;
    }

    if(!transporter.isIdle()){
        setTimeout(queueMails, 1000);
        return;
    }

    transporter.sendMail(messages.shift(), function (err) {
        if(err){
            console.log("Err when sending Mail: ");
            console.log(err);
        }
        queueMails();
    });
};

exports.setUpMailSystem = function (done){
    transporter = nodemailer.createTransport(config.mail);
    transporter.verify(done);
};

exports.sendMessage = function (from, to, subject, text, html, attachments){
    const message = {
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: html,
        attachments: attachments
    };
    messages.push(message);
    if(!isQueueMails){
        queueMails();
    }
};

exports.closeMailSystem = function () {
    if(transporter){
       transporter.close();
    }
    messages = [];
    isQueueMails = false;
};

exports.sendNotificationNewProduct = function(product){
    const that = this;
    const companyId = product.company_id;

    companyModel.findById(companyId, function (err, company) {
        if(err){
            console.log(err);
            return;
        }
        consumerModel.find({
            '_id': { $in : company.isConsumerOptIn},
            'optin': true
        }, function(err, consumers){
            if(err){
                console.log(err);
                return;
            }

            for(let i = 0; i < consumers.length; i++){
                that.sendMessage(
                    "no-reply@manualpik.com",
                    consumers[i].spamAddress,
                    "New Product - " + company.name,
                    "New Product on ManualPik\n\n" +
                    "Hey, " + consumers[i].username + ",\n" +
                    "there is new Product from " + company.name + ".\n\n" +
                    "Maybe you have also these Product from your favorite Brand or you thinking about to buy it.\n" +
                    "So check it out! \n\n" +
                    product.productName + "\n" +
                    utils.getServerUrl(config.server.adresse, config.server.port) + "/product?id=" + product._id +"\n\n" +
                    "Best Regards,\n" +
                    "Your ManualPik-Team",
                    "<h3>New Product on ManualPik</h3>" +
                    "<p>Hey, " + consumers[i].username + ",<br>" +
                    "there is new Product from <b>" + company.name + "</b><br>" +
                    "Maybe you have also these Product from your favorite Brand or you thinking about to buy it.\n" +
                    "So check it out!<br></p> " +
                    "<p><h5>" + product.productName + "</h5>" +
                    "<img src='" + product.profilePicture + "' style='height: 200px; width: 200px'><br>" +
                    "<a href='" + utils.getServerUrl(config.server.adresse, config.server.port) + "/product?id=" + product._id + "'>" + utils.getServerUrl(config.server.adresse, config.server.port) + "/product?id" + product._id  + "</a></p><br><br>" +
                    "<p>Best Regards <br>" +
                    "<i>Your ManualPik-Team</i></p>"
                )
            }
        });
    });
}