const API_BASE_URL = "http://localhost:3000/api";
const REQUEST_TIMEOUT_MS = 10000;

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = "Erro na requisicao.";
    try {
      const err = await response.json();
      errorMessage = err.message || errorMessage;
    } catch (_) {
      // noop
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function getProfessionals() {
  const response = await fetchWithTimeout(`${API_BASE_URL}/professionals`);
  return handleResponse(response);
}

async function getServices() {
  const response = await fetchWithTimeout(`${API_BASE_URL}/services`);
  return handleResponse(response);
}

async function getAvailableSlots({ professionalId, serviceId, date }) {
  const query = new URLSearchParams({
    professionalId: String(professionalId),
    serviceId: String(serviceId),
    date
  });
  const response = await fetchWithTimeout(`${API_BASE_URL}/appointments/available-slots?${query.toString()}`);
  return handleResponse(response);
}

async function createAppointment(payload) {
  const response = await fetchWithTimeout(`${API_BASE_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return handleResponse(response);
}
