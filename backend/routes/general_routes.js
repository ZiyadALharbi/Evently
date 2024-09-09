const {
  HomeEvents,
  getEvent,
  getFilteredSortedEvents,
  subscribe,
} = require("../controllers/general_controller.js");
const router = require("express").Router();

router.get("/home-events", HomeEvents);
router.get("/event/:id", getEvent);
router.get("/events", getFilteredSortedEvents);
router.post("/subscribe", subscribe)

module.exports = router;
