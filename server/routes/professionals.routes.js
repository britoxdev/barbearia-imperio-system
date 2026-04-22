const express = require("express");
const controller = require("../controllers/professionals.controller");

const router = express.Router();

router.get("/", controller.listProfessionals);
router.get("/:id", controller.getProfessionalById);

module.exports = router;
