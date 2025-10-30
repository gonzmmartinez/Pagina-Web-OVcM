const contenedorDocumentos = document.querySelector(".documentos-muestra");
const JSON_URL = "./documentos.json";

async function cargarDocumentos() {
  try {
    const res = await fetch(JSON_URL);
    const documentos = await res.json();

    // Ordenar únicamente por el campo "orden" (maneja valores nulos/indefinidos)
    const docsOrdenados = documentos
      .slice() // evita mutar el array original por si hace falta
      .sort((a, b) => ( (a.orden ?? 0) - (b.orden ?? 0) ));

    if (docsOrdenados.length === 0) {
      contenedorDocumentos.innerHTML = "<p>No se encontraron documentos.</p>";
    } else {
      const html = `<div class="grid-informes">
        ${docsOrdenados.map(doc => {
          return `
            <div class="tarjeta-informe">
              <a href="${doc.archivo}" target="_blank" rel="noopener noreferrer">
                <img src="${doc.portada}" alt="Portada de ${doc.titulo}">
                <h4>${doc.tipo_documento || ""}</h4>
                <h3>${doc.titulo}</h3>
              </a>
            </div>
          `;
        }).join("")}
      </div>`;
      contenedorDocumentos.innerHTML = html;
    }

  } catch (error) {
    contenedorDocumentos.innerHTML = `<p>Error al cargar los documentos.</p>`;
    console.error("Error al cargar documentos:", error);
  }
};


document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.header-container .nav-links');
  const icon = menuToggle.querySelector('img');

  menuToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');

    if (navLinks.classList.contains('open')) {
      icon.src = './svg/close_menu.svg';
      icon.style.transform = 'rotate(90deg)';
    } else {
      icon.src = './svg/menu.svg';
      icon.style.transform = 'rotate(0deg)';
    }
  });

  // Segundo header: menú toggle
  const menuToggleRepo = document.getElementById('menu-toggle-repo');
  const navLinksRepo = document.querySelector('.repository-header .nav-links');
  const iconRepo = menuToggleRepo.querySelector('img');

  menuToggleRepo.addEventListener('click', function () {
    navLinksRepo.classList.toggle('open');

    if (navLinksRepo.classList.contains('open')) {
      iconRepo.src = './svg/close_menu_w.svg';
      iconRepo.style.transform = 'rotate(90deg)';
    } else {
      iconRepo.src = './svg/menu_w.svg';
      iconRepo.style.transform = 'rotate(0deg)';
    }
  });
});

cargarDocumentos();
