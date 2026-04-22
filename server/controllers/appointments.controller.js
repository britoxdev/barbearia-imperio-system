const appointmentsModel = require("../models/appointments.model");
const servicesModel = require("../models/services.model");
const professionalsModel = require("../models/professionals.model");
const availabilityService = require("../services/availability.service");

function isValidDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function isValidTime(time) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

function isValidPhone(phone) {
  const digits = String(phone).replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 11;
}

function normalizePayload(payload, fallback = {}) {
  return {
    client_name: (payload.client_name || fallback.client_name || "").trim(),
    client_phone: (payload.client_phone || fallback.client_phone || "").trim(),
    professional_id: Number(payload.professional_id || fallback.professional_id),
    service_id: Number(payload.service_id || fallback.service_id),
    date: payload.date || fallback.date,
    start_time: payload.start_time || fallback.start_time
  };
}

async function listAppointments(req, res, next) {
  try {
    const { date, professionalId } = req.query;
    const data = await appointmentsModel.findAll({ date, professionalId });
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getAppointmentById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const item = await appointmentsModel.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Agendamento nao encontrado." });
    }

    return res.json(item);
  } catch (error) {
    return next(error);
  }
}

async function getAvailableSlots(req, res, next) {
  try {
    const professionalId = Number(req.query.professionalId);
    const serviceId = Number(req.query.serviceId);
    const date = req.query.date;

    if (!professionalId || !serviceId || !date) {
      return res.status(400).json({ message: "Informe professionalId, serviceId e date." });
    }

    const professional = await professionalsModel.findById(professionalId);
    if (!professional) {
      return res.status(404).json({ message: "Profissional nao encontrado." });
    }

    const service = await servicesModel.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Servico nao encontrado." });
    }

    const appointments = await appointmentsModel.findByProfessionalAndDate(professionalId, date);
    const slots = availabilityService.getAvailableStartTimes({
      serviceDurationMin: service.duration_min,
      existingAppointments: appointments
    });

    return res.json({
      professionalId,
      serviceId,
      date,
      durationMin: service.duration_min,
      availableSlots: slots
    });
  } catch (error) {
    return next(error);
  }
}

async function createAppointment(req, res, next) {
  try {
    const {
      client_name,
      client_phone,
      professional_id,
      service_id,
      date,
      start_time
    } = normalizePayload(req.body);

    if (!client_name || !client_phone || !professional_id || !service_id || !date || !start_time) {
      return res.status(400).json({ message: "Campos obrigatorios ausentes." });
    }

    if (!isValidPhone(client_phone)) {
      return res.status(400).json({ message: "Telefone invalido." });
    }

    if (!isValidDate(date) || !isValidTime(start_time)) {
      return res.status(400).json({ message: "Data ou horario invalido." });
    }

    const professional = await professionalsModel.findById(Number(professional_id));
    if (!professional) return res.status(404).json({ message: "Profissional nao encontrado." });

    const service = await servicesModel.findById(Number(service_id));
    if (!service) return res.status(404).json({ message: "Servico nao encontrado." });

    const end_time = availabilityService.addMinutes(start_time, service.duration_min);

    const scheduleCheck = availabilityService.isWithinBusinessRules({
      startTime: start_time,
      endTime: end_time
    });

    if (!scheduleCheck.valid) {
      return res.status(400).json({ message: scheduleCheck.reason });
    }

    const appointments = await appointmentsModel.findByProfessionalAndDate(Number(professional_id), date);
    const conflict = availabilityService.hasConflict({
      startTime: start_time,
      endTime: end_time,
      existingAppointments: appointments
    });

    if (conflict) {
      return res.status(409).json({ message: "Conflito de horario. Escolha outro horario." });
    }

    const created = await appointmentsModel.create({
      client_name,
      client_phone,
      professional_id: Number(professional_id),
      service_id: Number(service_id),
      date,
      start_time,
      end_time
    });

    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
}

async function updateAppointment(req, res, next) {
  try {
    const id = Number(req.params.id);
    const exists = await appointmentsModel.findById(id);

    if (!exists) {
      return res.status(404).json({ message: "Agendamento nao encontrado." });
    }

    const normalized = normalizePayload(req.body, exists);
    const professionalId = normalized.professional_id;
    const serviceId = normalized.service_id;
    const date = normalized.date;
    const startTime = normalized.start_time;

    if (!isValidPhone(normalized.client_phone)) {
      return res.status(400).json({ message: "Telefone invalido." });
    }

    if (!isValidDate(date) || !isValidTime(startTime)) {
      return res.status(400).json({ message: "Data ou horario invalido." });
    }

    const service = await servicesModel.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Servico nao encontrado." });

    const endTime = availabilityService.addMinutes(startTime, service.duration_min);

    const scheduleCheck = availabilityService.isWithinBusinessRules({
      startTime,
      endTime
    });

    if (!scheduleCheck.valid) {
      return res.status(400).json({ message: scheduleCheck.reason });
    }

    const appointments = await appointmentsModel.findByProfessionalAndDate(professionalId, date);
    const withoutCurrent = appointments.filter((a) => a.id !== id);
    const conflict = availabilityService.hasConflict({
      startTime,
      endTime,
      existingAppointments: withoutCurrent
    });

    if (conflict) {
      return res.status(409).json({ message: "Conflito de horario. Escolha outro horario." });
    }

    const updated = await appointmentsModel.update(id, {
      ...normalized,
      professional_id: professionalId,
      service_id: serviceId,
      date,
      start_time: startTime,
      end_time: endTime
    });

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
}

async function deleteAppointment(req, res, next) {
  try {
    const id = Number(req.params.id);
    const exists = await appointmentsModel.findById(id);

    if (!exists) {
      return res.status(404).json({ message: "Agendamento nao encontrado." });
    }

    await appointmentsModel.remove(id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listAppointments,
  getAppointmentById,
  getAvailableSlots,
  createAppointment,
  updateAppointment,
  deleteAppointment
};
