const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  credentials: {
    client_email: process.env.GCLOUD_CLIENT_EMAIL, 
    private_key: process.env.GCLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'), 
  },
});

const bucketName = process.env.GCLOUD_BUCKET_NAME; 
const bucket = storage.bucket(bucketName);

module.exports = bucket;
