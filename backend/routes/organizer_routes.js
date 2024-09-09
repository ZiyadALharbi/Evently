const {
  CreateEventRequest,
  DeleteEvent,
  EditEvent,
  getProfile,
  updateProfilePicture,
  getEvent,
  getRequestsByEvent,
  updateRequestStatus,
} = require("../controllers/organizer_controller.js");
const UserVerification = require("../middleware/auth_middleware.js");
const router = require("express").Router();
const verifyOrganizer = require("../middleware/organizer_middleware.js");
const upload = require("../middleware/upload_middleware.js");

router.post(
  "/create-event",
  UserVerification,
  upload.single("eventImage"),
  CreateEventRequest
);
router.delete(
  "/delete-event/:id",
  UserVerification,
  verifyOrganizer,
  DeleteEvent
);
router.put(
  "/edit-event/:id",
  UserVerification,
  upload.single("eventImage"),
  EditEvent
);
router.get("/profile", UserVerification, getProfile);
router.get("/event/:id", UserVerification, getEvent);
router.get("/show-requests/:eventId", UserVerification, getRequestsByEvent);
router.put("/update-request/:requestId", UserVerification, updateRequestStatus);
router.put(
  "/profile-picture",
  UserVerification,
  upload.single("photo"),
  updateProfilePicture
);

module.exports = router;
