// Variables globales
let guides = [];
let currentGuideId = 1;

// DOM Elements
const registerBtn = document.getElementById("registerBtn");
const registerBtnList = document.getElementById("registerBtnList");
const registerModal = document.getElementById("registerModal");
const closeModal = document.getElementById("closeModal");
const guideForm = document.getElementById("guideForm");
const historyModal = document.getElementById("historyModal");
const closeHistoryModal = document.getElementById("closeHistoryModal");
const searchInput = document.querySelector(".guide-list__input");
const searchForm = document.querySelector(".guide-list__form");

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  setupEventListeners();
  loadSampleData();
  updateStats();
  renderGuideList();
  setupStickyHeader();
});
function loadSampleData() {
  const sampleGuides = [
    {
      id: currentGuideId++,
      number: "001",
      origin: "Puerto Vallarta",
      destination: "Guadalajara",
      recipient: "Juan Pérez",
      creationDate: "2025-04-08",
      status: "pendiente",
      lastUpdate: "2025-04-08",
      history: [
        {
          date: new Date("2025-04-08").toISOString(),
          status: "pendiente",
          action: "Guía creada",
        },
      ],
    },
    {
      id: currentGuideId++,
      number: "002",
      origin: "Monterrey",
      destination: "Guadalajara",
      recipient: "María García",
      creationDate: "2025-04-07",
      status: "en_transito",
      lastUpdate: "2025-04-07",
      history: [
        {
          date: new Date("2025-04-07").toISOString(),
          status: "pendiente",
          action: "Guía creada",
        },
        {
          date: new Date("2025-04-07T10:30:00").toISOString(),
          status: "en_transito",
          action: "Estado actualizado a En Tránsito",
        },
      ],
    },
    {
      id: currentGuideId++,
      number: "003",
      origin: "Ciudad Guzman",
      destination: "Ciudad de México",
      recipient: "Carlos López",
      creationDate: "2025-04-06",
      status: "en_transito",
      lastUpdate: "2025-04-06",
      history: [
        {
          date: new Date("2025-04-06").toISOString(),
          status: "pendiente",
          action: "Guía creada",
        },
        {
          date: new Date("2025-04-06T14:15:00").toISOString(),
          status: "en_transito",
          action: "Estado actualizado a En Tránsito",
        },
      ],
    },
    {
      id: currentGuideId++,
      number: "004",
      origin: "Zacatecas",
      destination: "Salt Lake, USA",
      recipient: "Ana Martínez",
      creationDate: "2025-04-05",
      status: "entregado",
      lastUpdate: "2025-04-05",
      history: [
        {
          date: new Date("2025-04-05").toISOString(),
          status: "pendiente",
          action: "Guía creada",
        },
        {
          date: new Date("2025-04-05T09:00:00").toISOString(),
          status: "en_transito",
          action: "Estado actualizado a En Tránsito",
        },
        {
          date: new Date("2025-04-05T16:45:00").toISOString(),
          status: "entregado",
          action: "Estado actualizado a Entregado",
        },
      ],
    },
    {
      id: currentGuideId++,
      number: "005",
      origin: "Acapulco",
      destination: "Oaxaca",
      recipient: "Roberto Sánchez",
      creationDate: "2025-04-04",
      status: "entregado",
      lastUpdate: "2025-04-04",
      history: [
        {
          date: new Date("2025-04-04").toISOString(),
          status: "pendiente",
          action: "Guía creada",
        },
        {
          date: new Date("2025-04-04T11:20:00").toISOString(),
          status: "en_transito",
          action: "Estado actualizado a En Tránsito",
        },
        {
          date: new Date("2025-04-04T18:30:00").toISOString(),
          status: "entregado",
          action: "Estado actualizado a Entregado",
        },
      ],
    },
  ];

  guides.push(...sampleGuides);
}

// Configurar event listeners
function setupEventListeners() {
  registerBtn.addEventListener("click", openModal);
  if (registerBtnList) {
    registerBtnList.addEventListener("click", openModal);
  }
  closeModal.addEventListener("click", closeRegistrationModal);
  closeHistoryModal.addEventListener("click", closeHistoryModalFunc);
  guideForm.addEventListener("submit", handleFormSubmit);

  // Búsqueda
  if (searchForm) {
    searchForm.addEventListener("submit", handleSearch);
  }
  if (searchInput) {
    searchInput.addEventListener("input", handleSearchInput);
  }

  // Cerrar modal al hacer click fuera
  window.addEventListener("click", function (event) {
    if (event.target === registerModal) {
      closeRegistrationModal();
    }
    if (event.target === historyModal) {
      closeHistoryModalFunc();
    }
  });
}

// Abrir modal de registro
function openModal() {
  const generalStatusSection = document.getElementById("general-status");
  if (generalStatusSection) {
    generalStatusSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // Pequeño delay para que termine el scroll antes de abrir el modal
  setTimeout(() => {
    registerModal.classList.add("modal--active");
    // Establecer fecha actual por defecto
    document.getElementById("creationDate").value = new Date()
      .toISOString()
      .split("T")[0];
  }, 300);
}
function closeRegistrationModal() {
  registerModal.classList.remove("modal--active");
  clearForm();
  clearErrors();
}

// Cerrar modal de historial
function closeHistoryModalFunc() {
  historyModal.classList.remove("modal--active");
}

// Limpiar formulario
function clearForm() {
  guideForm.reset();
}

// Limpiar errores
function clearErrors() {
  const errorElements = document.querySelectorAll(".form__error");
  errorElements.forEach((error) => (error.textContent = ""));

  const inputElements = document.querySelectorAll(".form__input");
  inputElements.forEach((input) =>
    input.classList.remove("form__input--error")
  );
}

// Validar formulario
function validateForm(formData) {
  let isValid = true;
  clearErrors();

  // Validar número de guía
  if (!formData.guideNumber.trim()) {
    showError("guideNumberError", "El número de guía es obligatorio");
    isValid = false;
  } else if (guides.find((guide) => guide.number === formData.guideNumber)) {
    showError("guideNumberError", "Este número de guía ya existe");
    isValid = false;
  }

  // Validar origen
  if (!formData.origin.trim()) {
    showError("originError", "El origen es obligatorio");
    isValid = false;
  }

  // Validar destino
  if (!formData.destination.trim()) {
    showError("destinationError", "El destino es obligatorio");
    isValid = false;
  }

  // Validar destinatario
  if (!formData.recipient.trim()) {
    showError("recipientError", "El destinatario es obligatorio");
    isValid = false;
  }

  // Validar fecha
  if (!formData.creationDate) {
    showError("creationDateError", "La fecha de creación es obligatoria");
    isValid = false;
  }

  // Validar estado
  if (!formData.status) {
    showError("statusError", "El estado es obligatorio");
    isValid = false;
  }

  return isValid;
}

// Mostrar error
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  const inputElement = document.getElementById(elementId.replace("Error", ""));

  errorElement.textContent = message;
  inputElement.classList.add("form__input--error");
}

// Manejar envío del formulario
function handleFormSubmit(event) {
  event.preventDefault();

  const formData = {
    guideNumber: document.getElementById("guideNumber").value,
    origin: document.getElementById("origin").value,
    destination: document.getElementById("destination").value,
    recipient: document.getElementById("recipient").value,
    creationDate: document.getElementById("creationDate").value,
    status: document.getElementById("status").value,
  };

  if (validateForm(formData)) {
    createGuide(formData);
    closeRegistrationModal();
  }
}

// Crear nueva guía
function createGuide(formData) {
  const newGuide = {
    id: currentGuideId++,
    number: formData.guideNumber,
    origin: formData.origin,
    destination: formData.destination,
    recipient: formData.recipient,
    creationDate: formData.creationDate,
    status: formData.status,
    lastUpdate: new Date().toISOString().split("T")[0],
    history: [
      {
        date: new Date().toISOString(),
        status: formData.status,
        action: "Guía creada",
      },
    ],
  };

  guides.push(newGuide);
  updateStats();
  renderGuideList();
}

// Actualizar estadísticas
function updateStats() {
  const totalActive = guides.filter(
    (guide) => guide.status !== "entregado"
  ).length;
  const pending = guides.filter((guide) => guide.status === "pendiente").length;
  const inTransit = guides.filter(
    (guide) => guide.status === "en_transito"
  ).length;
  const delivered = guides.filter(
    (guide) => guide.status === "entregado"
  ).length;

  document.querySelector(
    ".stats__card:nth-child(1) .stats__card-value"
  ).textContent = totalActive;
  document.querySelector(
    ".stats__card:nth-child(2) .stats__card-value"
  ).textContent = pending;
  document.querySelector(
    ".stats__card:nth-child(3) .stats__card-value"
  ).textContent = inTransit;
  document.querySelector(
    ".stats__card:nth-child(4) .stats__card-value"
  ).textContent = delivered;
}

// Crear fila de guía
function createGuideRow(guide) {
  const row = document.createElement("tr");

  const statusClass = getStatusClass(guide.status);
  const statusText = getStatusText(guide.status);

  row.innerHTML = `
        <td data-label="Número de Guía">${guide.number}</td>
        <td data-label="Estado">
            <span class="status ${statusClass}">${statusText}</span>
        </td>
        <td data-label="Origen">${guide.origin}</td>
        <td data-label="Destino">${guide.destination}</td>
        <td data-label="Última Actualización">${guide.lastUpdate}</td>
        <td data-label="Acciones">
            <button class="btn btn--guide" onclick="updateGuideStatus(${guide.id})">
                Actualizar Estado
            </button>
            <button class="btn btn--secondary btn--guide" onclick="showHistory(${guide.id})">
                Ver Historial
            </button>
        </td>
    `;

  return row;
}

// Obtener clase CSS del estado
function getStatusClass(status) {
  switch (status) {
    case "pendiente":
      return "status--pending";
    case "en_transito":
      return "status--in-transit";
    case "entregado":
      return "status--delivered";
    default:
      return "";
  }
}

// Obtener texto del estado
function getStatusText(status) {
  switch (status) {
    case "pendiente":
      return "Pendiente";
    case "en_transito":
      return "En Tránsito";
    case "entregado":
      return "Entregado";
    default:
      return status;
  }
}

// Actualizar estado de guía
function updateGuideStatus(guideId) {
  const guide = guides.find((g) => g.id === guideId);
  if (!guide) return;

  const nextStatus = getNextStatus(guide.status);
  if (nextStatus) {
    guide.status = nextStatus;
    guide.lastUpdate = new Date().toISOString().split("T")[0];
    guide.history.push({
      date: new Date().toISOString(),
      status: nextStatus,
      action: `Estado actualizado a ${getStatusText(nextStatus)}`,
    });

    updateStats();
    renderGuideList();
  }
}

// Obtener siguiente estado en el flujo
function getNextStatus(currentStatus) {
  switch (currentStatus) {
    case "pendiente":
      return "en_transito";
    case "en_transito":
      return "entregado";
    case "entregado":
      return null;
    default:
      return null;
  }
}

// Mostrar historial de una guía
function showHistory(guideId) {
  const guide = guides.find((g) => g.id === guideId);
  if (!guide) return;

  const historyContent = document.getElementById("historyContent");
  const modalTitle = document.querySelector("#historyModal .modal__title");

  modalTitle.textContent = `Historial de Guía ${guide.number}`;

  historyContent.innerHTML = `
        <div class="history">
            <h3>Información de la Guía</h3>
            <p><strong>Número:</strong> ${guide.number}</p>
            <p><strong>Origen:</strong> ${guide.origin}</p>
            <p><strong>Destino:</strong> ${guide.destination}</p>
            <p><strong>Destinatario:</strong> ${guide.recipient}</p>
            
            <h3>Historial de Cambios</h3>
            <div class="history__timeline">
                ${guide.history
                  .map(
                    (entry) => `
                    <div class="history__entry">
                        <div class="history__date">${formatDate(
                          entry.date
                        )}</div>
                        <div class="history__action">${entry.action}</div>
                        <div class="history__status">Estado: ${getStatusText(
                          entry.status
                        )}</div>
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>
    `;

  historyModal.classList.add("modal--active");
}

// Formatear fecha
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Configurar navbar sticky
function setupStickyHeader() {
  const navbar = document.getElementById("navbar");
  const body = document.body;

  window.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY;

    if (scrollPosition > 100) {
      navbar.classList.add("navbar--sticky");
      body.classList.add("navbar-sticky");
    } else {
      navbar.classList.remove("navbar--sticky");
      body.classList.remove("navbar-sticky");
    }
  });
} // Funcionalidad de búsqueda
function handleSearch(event) {
  event.preventDefault();
  const searchTerm = searchInput.value.toLowerCase().trim();
  renderGuideList(searchTerm);
}

function handleSearchInput(event) {
  const searchTerm = event.target.value.toLowerCase().trim();
  renderGuideList(searchTerm);
}

// Renderizar lista de guías con filtro opcional
function renderGuideList(searchTerm = "") {
  const tableBody = document.querySelector(".table--guide-list tbody");

  if (!tableBody) return;

  let filteredGuides = guides;

  if (searchTerm) {
    filteredGuides = guides.filter(
      (guide) =>
        guide.number.toLowerCase().includes(searchTerm) ||
        guide.origin.toLowerCase().includes(searchTerm) ||
        guide.destination.toLowerCase().includes(searchTerm) ||
        getStatusText(guide.status).toLowerCase().includes(searchTerm)
    );
  }

  tableBody.innerHTML = "";

  if (filteredGuides.length === 0) {
    const noResultsRow = document.createElement("tr");
    noResultsRow.innerHTML = `
            <td colspan="6" style="text-align: center; padding: 2rem; color: #6c757d;">
                ${
                  searchTerm
                    ? "No se encontraron guías que coincidan con la búsqueda"
                    : "No hay guías registradas"
                }
            </td>
        `;
    tableBody.appendChild(noResultsRow);
    return;
  }

  filteredGuides.forEach((guide) => {
    const row = createGuideRow(guide);
    tableBody.appendChild(row);
  });
}
