const express = require("express");
const { getSlides } = require("../controllers/carousel.controller");

const router = express.Router();

router.get("/", getSlides);

module.exports = router;
