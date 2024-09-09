const User = require("../models/user_model.js");
const { createSecretToken } = require("../util/secret_token.js");
const bcrypt = require("bcryptjs");
const { uploadImageToCloudStorage } = require("../util/uploadImage.js");
const OrganizerRequest = require("../models/organizer_request_model.js");

const SignUp = async (req, res) => {
  try {
    const { email, password, firstname, lastname, username, role, phone } =
      req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    let photoUrl = null;
    if (req.file) {
      photoUrl = await uploadImageToCloudStorage(req.file);
    }

    if (role === "organizer") {
      const organizerRequest = await OrganizerRequest.create({
        email,
        firstname,
        lastname,
        username,
        phone,
        photo: photoUrl,
      });
      return res.status(201).json({
        message: "Organizer request sent successfully",
        success: true,
      });
    }


    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      username,
      role,
      phone,
      photo: photoUrl,
    });

    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    res
      .status(201)
      .json({ message: "User signed up successfully", success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.error(error);
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Incorrect password or email" });
    }

    console.log(bcrypt.compare(password, user.password));
    console.log("Stored Hashed Password:", user.password);


    user.lastLogin = new Date();
    await user.save();

    console.log(user.id);
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    console.log("User logged in successfully 11111");
    res.status(201).json({
      message: "User logged in successfully",
      success: true,
      token,
      id: user._id,
      role: user.role,
      username: user.username,
    });

    console.log("User logged in successfully");
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  SignUp,
  Login,
};
