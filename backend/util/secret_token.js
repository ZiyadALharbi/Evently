const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id) => {
  if (!process.env.TOKEN_KEY) {
    throw new Error("TOKEN_KEY is not set in environment variables");
  }
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: "7d",
  });
};
