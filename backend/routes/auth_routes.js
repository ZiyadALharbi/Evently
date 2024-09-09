const { SignUp, Login } = require("../controllers/auth_controller.js");
const router = require("express").Router();
const upload = require("../middleware/upload_middleware.js");

router.post("/signup", upload.single("photo"), SignUp);
router.post("/login", Login);

module.exports = router;
