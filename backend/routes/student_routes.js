const {
  ShowEvent,
  EventQuestions,
  SendRequest,
  addToBookmark,
  removeFromBookmark,
  profile,
  updateProfilePicture,
  cancelRequest,
  getBookmarks,
  getRequests,
} = require("../controllers/student_controller.js");
const UserVerification = require("../middleware/auth_middleware.js");
const router = require("express").Router();
const upload = require("../middleware/upload_middleware.js");

router.get("/show-event/:id", UserVerification, ShowEvent);
router.post("/send-request/:id", UserVerification, SendRequest);
router.get("/event-questions/:id", UserVerification, EventQuestions);
router.post("/add-bookmark/:id", UserVerification, addToBookmark);
router.delete(
  "/remove-bookmark/:eventId",
  UserVerification,
  removeFromBookmark
);
router.get("/profile", UserVerification, profile);
router.delete("/cancel-request/:id", UserVerification, cancelRequest);
router.get("/bookmarks", UserVerification, getBookmarks);
router.get("/requests", UserVerification, getRequests);
router.put(
  "/profile-picture",
  UserVerification,
  upload.single("photo"),
  updateProfilePicture
);

module.exports = router;
