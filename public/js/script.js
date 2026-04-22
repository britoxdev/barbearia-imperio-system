const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const bookingForm = document.getElementById("bookingForm");
const dateInput = document.getElementById("data");
const timeSelect = document.getElementById("hora");
const professionalSelect = document.getElementById("profissional");
const serviceSelect = document.getElementById("servico");
const feedback = document.getElementById("formFeedback");
const submitBtn = document.getElementById("submitBtn");
const servicesGrid = document.getElementById("servicesGrid");
const professionalsGrid = document.getElementById("professionalsGrid");
const nameInput = document.getElementById("nome");
const phoneInput = document.getElementById("telefone");

const fieldErrors = {
  nome: document.getElementById("errorNome"),
  telefone: document.getElementById("errorTelefone"),
  profissional: document.getElementById("errorProfissional"),
  servico: document.getElementById("errorServico"),
  data: document.getElementById("errorData"),
  hora: document.getElementById("errorHora")
};

const fieldInputs = {
  nome: nameInput,
  telefone: phoneInput,
  profissional: professionalSelect,
  servico: serviceSelect,
  data: dateInput,
  hora: timeSelect
};

const fallbackServices = [
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

const fallbackProfessionals = [
  { id: 1, name: "Pedro", specialty: "Corte classico" },
  { id: 2, name: "Vitor", specialty: "Degrade moderno" },
  { id: 3, name: "Rony", specialty: "Barba e visagismo" }
];

menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  navLinks.classList.toggle("show");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

phoneInput.addEventListener("input", () => {
  phoneInput.value = applyPhoneMask(phoneInput.value);
});

document.addEventListener("DOMContentLoaded", async () => {
  setFeedback("Carregando dados iniciais...", "info");
  resetTimes("Selecione profissional, servico e data");
  setMinimumDate();

  try {
    const [professionals, services] = await Promise.all([getProfessionals(), getServices()]);
    populateProfessionals(professionals);
    populateServices(services);
    renderProfessionals(professionals);
    renderServices(services);
    setFeedback("Dados carregados. Escolha seu horario.", "success");
  } catch (error) {
    populateProfessionals(fallbackProfessionals);
    populateServices(fallbackServices);
    renderProfessionals(fallbackProfessionals);
    renderServices(fallbackServices);
    setFeedback("API indisponivel no momento. Servicos exibidos localmente.", "info");
  }
});

professionalSelect.addEventListener("change", refreshAvailableSlots);
serviceSelect.addEventListener("change", refreshAvailableSlots);
dateInput.addEventListener("change", refreshAvailableSlots);

function setMinimumDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60000).toISOString().split("T")[0];
  dateInput.min = localDate;
}

function populateProfessionals(professionals) {
  professionalSelect.innerHTML = '<option value="">Selecione</option>';
  professionals.forEach((professional) => {
    professionalSelect.add(new Option(professional.name, String(professional.id)));
  });
}

function populateServices(services) {
  serviceSelect.innerHTML = '<option value="">Selecione</option>';
  services.forEach((service) => {
    const priceLabel = Number(service.price).toFixed(2).replace(".", ",");
    const label = `${service.name} (${service.duration_min} min) - a partir de R$ ${priceLabel}`;
    serviceSelect.add(new Option(label, String(service.id)));
  });
}

function renderServices(services) {
  servicesGrid.innerHTML = "";
  services.forEach((service) => {
    const card = document.createElement("article");
    card.className = "card service-card";
    card.innerHTML = `
      <h3>${service.name}</h3>
      <p>Atendimento profissional com acabamento premium.</p>
      <div class="service-meta">
        <span>${service.duration_min} min</span>
        <strong>a partir de R$ ${Number(service.price).toFixed(2).replace(".", ",")}</strong>
      </div>
    `;
    servicesGrid.appendChild(card);
  });
}

function renderProfessionals(professionals) {
  const photoByName = {
    rony: "./images/profissionais/rony.png",
    vitor: "./images/profissionais/vitor.png",
    pedro: "./images/profissionais/pedro.png"
  };

  professionalsGrid.innerHTML = "";
  professionals.forEach((professional) => {
    const key = (professional.name || "").toLowerCase();
    const photo = photoByName[key];
    const card = document.createElement("article");
    card.className = "card pro-card";
    card.innerHTML = `
      ${
        photo
          ? `<img class="pro-photo" src="${photo}" alt="Barbeiro ${professional.name}" loading="lazy" />`
          : `<div class="pro-avatar">${professional.name.charAt(0).toUpperCase()}</div>`
      }
      <h3>${professional.name}</h3>
      <p>${professional.specialty || "Especialista em barbearia."}</p>
    `;
    professionalsGrid.appendChild(card);
  });
}

async function refreshAvailableSlots() {
  const professionalId = professionalSelect.value;
  const serviceId = serviceSelect.value;
  const date = dateInput.value;

  if (!professionalId || !serviceId || !date) {
    resetTimes("Selecione profissional, servico e data");
    return;
  }

  resetTimes("Carregando horarios...");

  try {
    const result = await getAvailableSlots({ professionalId, serviceId, date });
    const slots = result.availableSlots || [];

    timeSelect.innerHTML = "";
    if (!slots.length) {
      timeSelect.add(new Option("Sem horarios disponiveis", ""));
      setFeedback("Nao ha horarios livres nesta data.", "error");
      return;
    }

    timeSelect.add(new Option("Selecione um horario", ""));
    slots.forEach((slot) => {
      timeSelect.add(new Option(slot, slot));
    });
    setFeedback("Horarios atualizados.", "info");
  } catch (error) {
    resetTimes("Erro ao carregar horarios");
    setFeedback(error.message || "Nao foi possivel buscar horarios.", "error");
  }
}

function resetTimes(message) {
  timeSelect.innerHTML = "";
  timeSelect.add(new Option(message, ""));
}

function setFeedback(message, type) {
  feedback.textContent = message;
  feedback.classList.remove("success", "error", "info");
  feedback.classList.add(type);
}

function clearFieldErrors() {
  Object.keys(fieldErrors).forEach((key) => {
    fieldErrors[key].textContent = "";
    fieldInputs[key].classList.remove("input-error");
  });
}

function setFieldError(field, message) {
  fieldErrors[field].textContent = message;
  fieldInputs[field].classList.add("input-error");
}

function validateForm() {
  clearFieldErrors();
  let isValid = true;

  if (!nameInput.value.trim()) {
    setFieldError("nome", "Informe seu nome.");
    isValid = false;
  }

  if (phoneInput.value.replace(/\D/g, "").length < 10) {
    setFieldError("telefone", "Telefone invalido.");
    isValid = false;
  }

  if (!professionalSelect.value) {
    setFieldError("profissional", "Selecione um profissional.");
    isValid = false;
  }

  if (!serviceSelect.value) {
    setFieldError("servico", "Selecione um servico.");
    isValid = false;
  }

  if (!dateInput.value) {
    setFieldError("data", "Selecione uma data.");
    isValid = false;
  }

  if (!timeSelect.value) {
    setFieldError("hora", "Selecione um horario.");
    isValid = false;
  }

  return isValid;
}

bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateForm()) {
    setFeedback("Corrija os campos obrigatorios.", "error");
    return;
  }

  const payload = {
    client_name: nameInput.value.trim(),
    client_phone: phoneInput.value.trim(),
    professional_id: Number(professionalSelect.value),
    service_id: Number(serviceSelect.value),
    date: dateInput.value,
    start_time: timeSelect.value
  };

  try {
    submitBtn.disabled = true;
    setFeedback("Enviando agendamento...", "info");
    const result = await createAppointment(payload);
    setFeedback(`Agendamento confirmado para ${result.date} as ${result.start_time}.`, "success");
    bookingForm.reset();
    clearFieldErrors();
    setMinimumDate();
    resetTimes("Selecione profissional, servico e data");
  } catch (error) {
    setFeedback(error.message || "Erro ao criar agendamento.", "error");
  } finally {
    submitBtn.disabled = false;
  }
});

function applyPhoneMask(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}
