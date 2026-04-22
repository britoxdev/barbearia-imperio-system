const express = require("express");
const controller = require("../controllers/services.controller");

const router = express.Router();

router.get("/", controller.listServices);
router.get("/:id", controller.getServiceById);

module.exports = router;
