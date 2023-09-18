const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  blockUser,
} = require("../controllers/userController");

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllUsers);
router
  .route("/:id")
  .patch(authenticateUser, authorizePermissions("admin"), blockUser);

router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/updateUser").put(authenticateUser,updateUser);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
