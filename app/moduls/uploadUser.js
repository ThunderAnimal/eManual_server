const fs = require("fs");
const uuidv4 = require("uuid/v4");
const Storage = require("@google-cloud/storage");
const CLOUD_BUCKET = "product_resources";

const storage = Storage({
    projectId: 'angelic-hold-186609',
    keyFilename: __dirname.substring(0,__dirname.length-10)+'My First Project-844704f257d4.json'
});

const bucket = storage.bucket(CLOUD_BUCKET);

const uploadUser = (content, cb) => {

    const filesList = content;
    var count=0;
    var imgUrl=[];
    var resUrl=[];
    var urlList = [];

    for(var i = 0; i < filesList.length; i++){
        const gcsname = uuidv4() +'_'+filesList[i].originalname;
        const files = bucket.file(gcsname);

        fs.createReadStream(filesList[i].path)
            .pipe(files.createWriteStream({
                metadata: {
                    contentType: filesList[i].mimetype
                }
            }))
            .on("error", (err) => {
                console.log(err)
            })
            .on('finish', () => {
                count++;
                var fileUrl = `https://storage.googleapis.com/${CLOUD_BUCKET}/${gcsname}`;
                console.log(fileUrl);
                if(fileUrl.endsWith("jpg"||"png"||"jpeg"||"gif"||"tiff")){
                    imgUrl.push(fileUrl);
                }else{
                    resUrl.push(fileUrl);
                }
                if(filesList.length === count){
                    urlList.push(imgUrl);
                    urlList.push(resUrl);
                    cb(urlList);
                }
            });
    }
};

module.exports = uploadUser;