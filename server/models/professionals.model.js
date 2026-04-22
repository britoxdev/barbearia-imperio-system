const professionals = [
  { id: 1, name: "Pedro", specialty: "Corte classico", photo: null },
  { id: 2, name: "Vitor", specialty: "Degrade moderno", photo: null },
  { id: 3, name: "Rony", specialty: "Barba e visagismo", photo: null }
];

async function findAll() {
  return professionals;
}

async function findById(id) {
  return professionals.find((p) => p.id === id) || null;
}

module.exports = {
  findAll,
  findById
};
