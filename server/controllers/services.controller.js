const servicesModel = require("../models/services.model");

async function listServices(req, res, next) {
  try {
    const data = await servicesModel.findAll();
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getServiceById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const service = await servicesModel.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Servico nao encontrado." });
    }

    return res.json(service);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listServices,
  getServiceById
};
