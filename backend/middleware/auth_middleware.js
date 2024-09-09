const jwt = require("jsonwebtoken");
const User = require("../models/user_model.js");

const UserVerification = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  console.log("here 1 user verification");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Please Login to access this resource, no bearer" });
  }
  console.log("here 2");

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Please Login to access this resource" });
  }

  try {
    const decodedData = jwt.verify(token, process.env.TOKEN_KEY);
    console.log(token);
    console.log("here 2");

    req.user = await User.findById(decodedData.id);
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    console.log("here 3");
    console.log("here 3");

    next();
    console.log("here 4");
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = UserVerification;
