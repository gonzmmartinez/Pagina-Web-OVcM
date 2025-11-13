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