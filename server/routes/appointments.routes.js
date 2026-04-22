const express = require("express");
const controller = require("../controllers/appointments.controller");

const router = express.Router();

router.get("/", controller.listAppointments);
router.get("/available-slots", controller.getAvailableSlots);
router.get("/:id", controller.getAppointmentById);

router.post("/", controller.createAppointment);
router.put("/:id", controller.updateAppointment);
router.delete("/:id", controller.deleteAppointment);

module.exports = router;
