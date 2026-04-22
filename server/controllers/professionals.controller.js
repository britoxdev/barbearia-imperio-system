const professionalsModel = require("../models/professionals.model");

async function listProfessionals(req, res, next) {
  try {
    const data = await professionalsModel.findAll();
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getProfessionalById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const professional = await professionalsModel.findById(id);

    if (!professional) {
      return res.status(404).json({ message: "Profissional nao encontrado." });
    }

    return res.json(professional);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listProfessionals,
  getProfessionalById
};
