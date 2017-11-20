const fs = require("fs");
const restify = require("restify");
const uuidv4 = require("uuid/v4");
const Storage = require("@google-cloud/storage");
const CLOUD_BUCKET = "product_resources";
const storage = Storage({
    projectId: 'angelic-hold-186609',
    keyFilename: '/path/to/file/downloaded/in/step/3'
})
const bucket = storage.bucket(CLOUD_BUCKET);

const uploadUser = (req, res) => {

    const file = req;
    console.log(file.mimetype);
    const gcsname = uuidv4() + file.name;
    const files = bucket.file(gcsname);

    fs.createReadStream(file.path)
        .pipe(files.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        }))
        .on("error", (err) => {
        console.log('Internal Error')
})
.on('finish', () => {
        res.json({
        success: true,
        fileUrl: `https://storage.googleapis.com/${CLOUD_BUCKET}/${gcsname}`
    })
});
};

module.exports = uploadUser;