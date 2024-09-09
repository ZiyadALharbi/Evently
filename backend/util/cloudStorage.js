const { Storage } = require("@google-cloud/storage");
const path = require("path");

const storage = new Storage({
  keyFilename: path.join(__dirname, "./second-scion-329017-832d12920ce3.json"),
  projectId: "second-scion-329017",
});

const bucketName = "evently-app-images";
const bucket = storage.bucket(bucketName);

module.exports = bucket;
