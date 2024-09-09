const router = require("express").Router();
const UserVerification = require("../middleware/auth_middleware.js");
const {
  emails,
  viewAllUsers,
  getOrganizerRequests,
  manageOrganizerRequests,
  getActivityLogs,
  getActiveUsersMetrics,
  getUserGrowthTracking,
  getAllEvents,
  getEventRequests,
  approveEventRequest,
  getEventPerformanceInsights,
  getPopularEventsTracking,
  manageEventCategories,
  getPlatformUsageStatistics,
} = require("../controllers/admin_controller.js");

router.get("/users", UserVerification, viewAllUsers);
router.get("/emails", UserVerification, emails);
router.get("/organizer-requests", getOrganizerRequests);
router.put(
  "/manage-organizer-request/:id",
  UserVerification,
  manageOrganizerRequests
);
router.get("/activity-logs", UserVerification, getActivityLogs);
router.get("/active-users-metrics", UserVerification, getActiveUsersMetrics);
router.get("/user-growth-tracking", UserVerification, getUserGrowthTracking);

router.get("/events", UserVerification, getAllEvents);
router.get("/event-requests", UserVerification, getEventRequests);
router.put("/approve-event/:id", UserVerification, approveEventRequest);
router.get(
  "/event-performance-insights",
  UserVerification,
  getEventPerformanceInsights
);
router.get(
  "/popular-events-tracking",
  UserVerification,
  getPopularEventsTracking
);
router.put("/category-management", UserVerification, manageEventCategories);

router.get("/usage-statistics", UserVerification, getPlatformUsageStatistics);

module.exports = router;
