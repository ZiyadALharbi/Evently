
const bucket = require("./cloudStorage.js");
const uploadImageToCloudStorage = async (file) => {
  if (!file) return null;

  const blob = bucket.file(file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => {
      console.error("Error uploading image to Cloud Storage:", err);
      reject("Error uploading image to Cloud Storage");
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

module.exports = {uploadImageToCloudStorage};
