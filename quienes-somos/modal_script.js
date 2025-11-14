// SCRIPT DEL MODAL QUE ABRE EL PDF CON LA LEY

const botonLey = document.getElementById("abrir-modal-ley");
const modalLey = document.getElementById("modal-pdf");
const cerrarLey = document.getElementById("cerrar-modal-ley");

botonLey.addEventListener("click", () => {
  modalLey.classList.remove("hidden");
});

cerrarLey.addEventListener("click", () => {
  modalLey.classList.add("hidden");
});

// Permite cerrar el modal haciendo clic fuera del contenido
modalLey.addEventListener("click", (e) => {
  if (e.target === modalLey) {
    modalLey.classList.add("hidden");
  }
});

// ====== MODAL DE DIRECTORAS ======
const modalDirectora = document.getElementById("modal-directora");
const cerrarModalDirectora = document.getElementById("cerrar-modal-directora");

const modalTitulo = document.getElementById("modal-title");
const modalDescripcion = document.getElementById("modal-description");
const modalImg = document.getElementById("modal-img");

// Esperar a que se generen las tarjetas
document.addEventListener("tarjetas-cargadas", () => {
  const tarjetas = document.querySelectorAll(".directora-card");

  tarjetas.forEach(card => {
    card.addEventListener("click", () => {
      modalTitulo.textContent = card.dataset.nombre;
      modalDescripcion.innerHTML = card.dataset.desc
        .split("\n")
        .map(line => `<p>${line}</p>`)
        .join("");
      modalImg.src = card.dataset.img;
      modalImg.alt = card.dataset.nombre;

      modalDirectora.classList.remove("hidden");
    });
  });
});

// Cerrar con botón
cerrarModalDirectora.addEventListener("click", () => {
  modalDirectora.classList.add("hidden");
});

// Cerrar clic afuera
modalDirectora.addEventListener("click", (e) => {
  if (e.target === modalDirectora) {
    modalDirectora.classList.add("hidden");
  }
});

