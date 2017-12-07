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

exports.uploadFiles = function (content, cb) {
    const filesList = content;
    let urlList = [];

    const helperUpload = function (counter) {
        if(counter >= filesList.length){
            cb(urlList);
            delteFiles(filesList);
            return;
        }

        const gcsname = uuidv4() +'_'+filesList[counter].originalname;
        const files = bucket.file(gcsname);


        fs.createReadStream(filesList[counter].path)
            .pipe(files.createWriteStream({
                metadata: {
                    contentType: filesList[counter].mimetype
                }
            }))
            .on("error", function (err) {
                console.log(err);

                counter += 1;
                urlList.push('');

                helperUpload(counter);
            })
            .on('finish',function () {
                counter += 1;

                urlList.push(`https://storage.googleapis.com/${CLOUD_BUCKET}/${gcsname}`);

                helperUpload(counter);
            });
    };

    helperUpload(0);
};

exports.deleteFiles = function(content, cb){
    const filesList = content;

    for(let i = 0; i < filesList.length; i++){
        const file = bucket.file(filesList[i]);
        file.delete(function(err, apiResponse) {});
    }

    cb();
};
