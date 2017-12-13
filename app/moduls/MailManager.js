const config = require("config");
const nodemailer = require('nodemailer');

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