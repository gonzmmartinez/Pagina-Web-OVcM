const contenedorFolleteria = document.querySelector(".galeria-folletos");
const JSON_URL = "./documentos_folleteria.json";

async function cargarFolleteria() {
  try {
    const res = await fetch(JSON_URL);
    const documentos = await res.json();

    // Ordenar por fecha descendente
    const folleteriaDocs = documentos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    if (folleteriaDocs.length === 0) {
      contenedorFolleteria.innerHTML = "<p>No se encontraron materiales de folletería.</p>";
    } else {
      const html = `<div class="grid-folletos">
        ${folleteriaDocs.map((doc, index) => `
          <div class="tarjeta-folletos clickable-folleto" data-index="${index}" data-slug="${doc.slug}">
            <div class="slider">
              <img src="${doc.galeria[0]}" alt="Imagen 1 de ${doc.titulo}">
            </div>
            <h3>${doc.titulo}</h3>
          </div>
        `).join("")}
      </div>`;
      contenedorFolleteria.innerHTML = html;

      // Lógica de hover/slider
      const tarjetas = document.querySelectorAll(".tarjeta-folletos");

      tarjetas.forEach((tarjeta) => {
        const index = tarjeta.getAttribute("data-index");
        const doc = folleteriaDocs[index];
        const slider = tarjeta.querySelector(".slider img");

        let current = 0;
        let intervalId = null;

        tarjeta.addEventListener("mouseenter", () => {
          intervalId = setInterval(() => {
            current = (current + 1) % doc.galeria.length;
            slider.src = doc.galeria[current];
          }, 500);
        });

        tarjeta.addEventListener("mouseleave", () => {
          clearInterval(intervalId);
          current = 0;
          slider.src = doc.galeria[0]; // Reiniciar a la primera imagen
        });
      });

      // Click en tarjeta para mostrar el detalle
      document.querySelectorAll(".clickable-folleto").forEach(tarjeta => {
        tarjeta.addEventListener("click", () => {
          const slug = tarjeta.getAttribute("data-slug");

          // Agregar ?doc=slug a la URL sin recargar la página
          history.pushState(null, "", `?doc=${slug}`);

          mostrarDetalleFolleto(slug, folleteriaDocs);
        });
      });
    }

  } catch (error) {
    contenedorFolleteria.innerHTML = `<p>Error al cargar los materiales de folletería.</p>`;
    console.error("Error al cargar folletería:", error);
  }
}

async function mostrarDetalleFolleto(slug, documentos) {
  const doc = documentos.find(d => d.slug === slug);
  if (!doc) {
    contenedorFolleteria.innerHTML = `<p>Folleto no encontrado.</p><a href="index.html">← Volver</a>`;
    return;
  }

  try {
    const res = await fetch("detalle_folleteria.html");
    const html = await res.text();
    contenedorFolleteria.innerHTML = html;

    // Portada
    document.getElementById("portada-doc").src = doc.portada || doc.galeria?.[0] || "";
    document.getElementById("portada-doc").alt = `Portada de ${doc.titulo}`;

    // Títulos
    document.getElementById("main-titulo-doc").textContent = doc.titulo;
    document.getElementById("titulo-doc").textContent = doc.titulo;
    document.getElementById("fecha-doc").textContent = formatearFecha(doc.fecha);
    document.title = `${doc.titulo} | Folletería | Repositorio digital | OVcM`;

    // Descarga
    document.getElementById("link-descarga").href = doc.archivo.trim();
    document.getElementById("url-doc").textContent = doc.archivo.trim();
    document.getElementById("url-doc").href = doc.archivo.trim();

    // Autores
    if (doc.autor && Array.isArray(doc.autor)) {
      document.getElementById("autor-doc").textContent = doc.autor.join(", ");
    }

  } catch (error) {
    contenedorFolleteria.innerHTML = `<p>Error al cargar el detalle del folleto.</p>`;
    console.error("Error al mostrar detalle:", error);
  }

  // Carrousel de galería
  if (Array.isArray(doc.galeria) && doc.galeria.length > 0) {
    const carrContainer = document.querySelector(".carrousel-galeria");

    let currentIndex = 0;

    function renderCarousel() {
      const prevIndex = (currentIndex - 1 + doc.galeria.length) % doc.galeria.length;
      const nextIndex = (currentIndex + 1) % doc.galeria.length;

      carrContainer.innerHTML = `
        <div class="carousel-wrapper">
          ${doc.galeria.length > 1 ? `<img src="${doc.galeria[prevIndex]}" class="carousel-img small blurred" />` : ""}
          <img src="${doc.galeria[currentIndex]}" class="carousel-img active" />
          ${doc.galeria.length > 1 ? `<img src="${doc.galeria[nextIndex]}" class="carousel-img small blurred" />` : ""}
          ${doc.galeria.length > 1 ? `
            <button class="carousel-btn prev"><img src="../svg/navigation_back.svg" alt="Anterior" /></button>
            <button class="carousel-btn next"><img src="../svg/navigation_forward.svg" alt="Siguiente" /></button>
          ` : ""}
        </div>
      `;


      // Botones
      carrContainer.querySelector(".prev").addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + doc.galeria.length) % doc.galeria.length;
        renderCarousel();
      });

      carrContainer.querySelector(".next").addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % doc.galeria.length;
        renderCarousel();
      });
    }

    renderCarousel();
  }
}

function formatearFecha(fechaISO) {
  const opciones = { year: "numeric", month: "long" };
  const fecha = new Date(fechaISO).toLocaleDateString("es-AR", opciones);
  return fecha.charAt(0).toUpperCase() + fecha.slice(1);
}

// Inicializar
cargarFolleteria();
