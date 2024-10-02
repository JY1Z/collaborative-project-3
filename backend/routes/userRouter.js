const express = require("express");
const router = express.Router();

const { requireAuth  } = require("../middleware/requireAuth");
const { loginUser, signupUser, getMe } = require("../controllers/userControllers");
  
// login route
router.post("/login", loginUser);
  
// signup route
router.post("/signup", signupUser);

// Protected route - user must be authenticated to access this
router.get("/me", requireAuth , getMe);

module.exports = router;