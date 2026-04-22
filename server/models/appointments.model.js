let appointments = [];
let idCounter = 1;

async function findAll(filters = {}) {
  return appointments.filter((a) => {
    if (filters.date && a.date !== filters.date) return false;
    if (filters.professionalId && a.professional_id !== Number(filters.professionalId)) return false;
    return true;
  });
}

async function findById(id) {
  return appointments.find((a) => a.id === id) || null;
}

async function findByProfessionalAndDate(professionalId, date) {
  return appointments.filter(
    (a) => a.professional_id === Number(professionalId) && a.date === date
  );
}

async function create(data) {
  const item = { id: idCounter++, ...data };
  appointments.push(item);
  return item;
}

async function update(id, data) {
  appointments = appointments.map((item) =>
    item.id === id ? { ...item, ...data, id } : item
  );
  return findById(id);
}

async function remove(id) {
  appointments = appointments.filter((item) => item.id !== id);
}

module.exports = {
  findAll,
  findById,
  findByProfessionalAndDate,
  create,
  update,
  remove
};
