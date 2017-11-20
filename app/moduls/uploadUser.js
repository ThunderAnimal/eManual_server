const fs = require("fs");
const restify = require("restify");
const uuidv4 = require("uuid/v4");
const Storage = require("@google-cloud/storage");
const CLOUD_BUCKET = "product_resources";
const storage = Storage({
    projectId: 'angelic-hold-186609',
    keyFilename: 'C:/Users/pc/Documents/GitHub/eManual_server/My First Project-844704f257d4.json'
})

const bucket = storage.bucket(CLOUD_BUCKET);

const uploadUser = (req, cb) => {

    const file = req;
    const gcsname = uuidv4() + file.filename;
    const files = bucket.file(gcsname);
    console.log(req);
    console.log(gcsname);

    fs.createReadStream(file.path)
        .pipe(files.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        }))
        .on("error", (err) => {
        console.log(err)
})
.on('finish', () => {
        var fileUrl = `https://storage.googleapis.com/${CLOUD_BUCKET}/${gcsname}`;
        cb(fileUrl);
});
};

module.exports = uploadUser;