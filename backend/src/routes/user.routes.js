const express = require("express");
const { getUsers } = require("../controllers/user.controller");
const { authMiddleware, adminMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getUsers);

module.exports = router;
