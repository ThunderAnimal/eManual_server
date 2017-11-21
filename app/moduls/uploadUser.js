const fs = require("fs");
const uuidv4 = require("uuid/v4");
const Storage = require("@google-cloud/storage");
const CLOUD_BUCKET = "product_resources";

const storage = Storage({
    projectId: 'angelic-hold-186609',
    keyFilename: __dirname.substring(0,__dirname.length-10)+'My First Project-844704f257d4.json'
});

const bucket = storage.bucket(CLOUD_BUCKET);

const delteFiles = function(files){
    for(let i = 0; i < files.length; i++){
        fs.unlink(files[i].path, function (err) {
            if(err){
                console.log(err)
            }
        });
    }
};

const uploadUser = function (content, cb) {

    const filesList = content;
    let count = 0;
    let urlList = [];

    let isFinish = function(){
        if(filesList.length === count){
            delteFiles(filesList);
            cb(urlList);
        }
    };

    for(let i = 0; i < filesList.length; i++){
        const gcsname = uuidv4() +'_'+filesList[i].originalname;
        const files = bucket.file(gcsname);

        fs.createReadStream(filesList[i].path)
            .pipe(files.createWriteStream({
                metadata: {
                    contentType: filesList[i].mimetype
                }
            }))
            .on("error", function (err) {
                count++;

                console.log(err);

                isFinish();
            })
            .on('finish',function () {
                count++;

                const fileUrl = `https://storage.googleapis.com/${CLOUD_BUCKET}/${gcsname}`;
                urlList.push(fileUrl);

                isFinish();
            });
    }
};

module.exports = uploadUser;