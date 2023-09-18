const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");
const upload = require("../middlewares/multer");
const {
  createTour,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
  uploadImages,
  getFeaturedTour,
  getTourBySearch,
  getTourCount,
  getToursByVendor,
  verifyTour,
  featureTour,
  getVerifiedTours,
  getAvailableTimeSlots,
} = require("../controllers/tourController");

const { getSingleTourReviews } = require("../controllers/reviewController");

router
  .route("/")
  .post([authenticateUser, authorizePermissions("vendor", "admin")], createTour)
  .get(getAllTours);

router.route("/verified").get(getVerifiedTours);

router.get("/vendor/:id", getToursByVendor);
router.post("/uploadImage", [authenticateUser], upload, uploadImages);

router
  .route("/:id")
  .get(getSingleTour)
  .patch(
    [authenticateUser, authorizePermissions("admin", "vendor")],
    updateTour
  )
  .delete(
    [authenticateUser, authorizePermissions("admin", "vendor")],
    deleteTour
  );

router
  .route("/verify/:id")
  .patch([authenticateUser, authorizePermissions("admin")], verifyTour);
router
  .route("/feature/:id")
  .patch([authenticateUser, authorizePermissions("admin")], featureTour);
// get tour by search
router.get("/search/getTourBySearch", getTourBySearch);
router.get("/search/getFeaturedTours", getFeaturedTour);
router.get("/search/getTourCount", getTourCount);
router.get("/available/:id", getAvailableTimeSlots);
router.route("/:id/reviews").get(getSingleTourReviews);

module.exports = router;
