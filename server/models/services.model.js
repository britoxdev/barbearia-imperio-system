const services = [
  { id: 1, name: "Barba", duration_min: 30, price: 25.0 },
  { id: 2, name: "Corte + barba", duration_min: 50, price: 63.0 },
  { id: 3, name: "Corte + barba + sobrancelha", duration_min: 45, price: 73.0 },
  { id: 4, name: "Corte com um numero", duration_min: 30, price: 25.0 },
  { id: 5, name: "Corte degrade", duration_min: 25, price: 38.0 },
  { id: 6, name: "Corte navalhado", duration_min: 25, price: 43.0 },
  { id: 7, name: "Corte navalhado + barba", duration_min: 50, price: 68.0 },
  { id: 8, name: "Corte navalhado + sobrancelha", duration_min: 30, price: 50.0 },
  { id: 9, name: "Crianca", duration_min: 30, price: 38.0 },
  { id: 10, name: "Hidratacao no cabelo", duration_min: 30, price: 25.0 },
  { id: 11, name: "Limpeza de pele com vaporizador ozonio", duration_min: 30, price: 40.0 },
  { id: 12, name: "Penteados", duration_min: 30, price: 38.0 },
  { id: 13, name: "Pezinho", duration_min: 10, price: 10.0 },
  { id: 14, name: "Pigmentacao", duration_min: 15, price: 25.0 },
  { id: 15, name: "Relaxamento", duration_min: 30, price: 40.0 },
  { id: 16, name: "Sobrancelha", duration_min: 5, price: 10.0 },
  { id: 17, name: "Tesoura", duration_min: 25, price: 43.0 }
];

async function findAll() {
  return services;
}

async function findById(id) {
  return services.find((s) => s.id === id) || null;
}

module.exports = {
  findAll,
  findById
};
