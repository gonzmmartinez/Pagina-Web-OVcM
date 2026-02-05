const contenedorDosieres = document.querySelector(".concursos-muestra");
const contenedorDiseno = document.querySelector(".concursos-muestra-2");
const JSON_URL = "./documentos_concursos.json";

async function cargarDosieres() {
  try {
    const res = await fetch(JSON_URL);
    const documentos = await res.json();

    // Filtrar y ordenar dosieres
    const dosieres = documentos
      .filter(doc => {
        if (Array.isArray(doc.tipo_concurso)) {
          return doc.tipo_concurso.includes("Tesis");
        }
        return doc.tipo_concurso === "Tesis";
      })
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    if (dosieres.length === 0) {
      contenedorDosieres.innerHTML = "<p>No se encontraron dosieres.</p>";
    } else {
      const html = `<div class="grid-informes">
        ${dosieres.map(doc => {
          const anio = new Date(doc.fecha).getFullYear();
          return `
            <div class="tarjeta-informe">
              <a href="${doc.archivo}" target="_blank" rel="noopener noreferrer">
                <img src="${doc.portada}" alt="Portada de ${doc.titulo}">
                <h4>${anio}</h4>
                <h3>${doc.titulo}</h3>
              </a>
            </div>
          `;
        }).join("")}
      </div>`;
      contenedorDosieres.innerHTML = html;
    }

  } catch (error) {
    contenedorDosieres.innerHTML = `<p>Error al cargar los dosieres.</p>`;
    console.error("Error al cargar dosieres:", error);
  }
};

async function cargarDiseno() {
  try {
    const res = await fetch(JSON_URL);
    const documentos = await res.json();

    const disenos = documentos
      .filter(doc => {
        if (Array.isArray(doc.tipo_concurso)) {
          return doc.tipo_concurso.includes("Diseño");
        }
        return doc.tipo_concurso === "Diseño";
      })
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    if (disenos.length === 0) {
      contenedorDiseno.innerHTML = "<p>No se encontraron documentos de diseño.</p>";
    } else {
      const html = `<div class="grid-informes">
        ${disenos.map(doc => {
          const anio = new Date(doc.fecha).getFullYear();
          return `
            <div class="tarjeta-informe">
              <a href="${doc.archivo}" target="_blank" rel="noopener noreferrer">
                <img src="${doc.portada}" alt="Portada de ${doc.titulo}">
                <h4>${anio}</h4>
                <h3>${doc.titulo}</h3>
              </a>
            </div>
          `;
        }).join("")}
      </div>`;
      contenedorDiseno.innerHTML = html;
    }

  } catch (error) {
    contenedorDiseno.innerHTML = `<p>Error al cargar los documentos de diseño.</p>`;
    console.error("Error al cargar documentos de diseño:", error);
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

cargarDosieres();
cargarDiseno();
