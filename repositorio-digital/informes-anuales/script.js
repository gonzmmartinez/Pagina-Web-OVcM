const contenedorInformes = document.querySelector(".repositorio-muestra");
const contenedorResumenes = document.querySelector(".repositorio-muestra-2");
const JSON_URL = "../documentos-repositorio.json";

async function cargarInformesAnuales() {
  try {
    const res = await fetch(JSON_URL);
    const documentos = await res.json();

    // Informes anuales
    const informesAnuales = documentos
      .filter(doc => {
        if (Array.isArray(doc.tipo_documento)) {
          return doc.tipo_documento.includes("Informe anual");
        }
        return doc.tipo_documento === "Informe anual";
      })
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    if (informesAnuales.length === 0) {
      contenedorInformes.innerHTML = "<p>No se encontraron informes anuales.</p>";
    } else {
      const html = `<div class="grid-informes">
        ${informesAnuales.map(doc => `
          <div class="tarjeta-informe">
            <a href="../?doc=${doc.slug}">
              <img src="${doc.portada}" alt="Portada de ${doc.titulo}">
              <h3>${doc.titulo}</h3>
            </a>
          </div>
        `).join("")}
      </div>`;
      contenedorInformes.innerHTML = html;
    }

    // Resúmenes ejecutivos del informe anual
    const resumenesEjecutivos = documentos
      .filter(doc => {
        if (Array.isArray(doc.tipo_documento)) {
          return doc.tipo_documento.includes("Resumen ejecutivo del informe anual");
        }
        return doc.tipo_documento === "Resumen ejecutivo del informe anual";
      })
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    if (resumenesEjecutivos.length === 0) {
      contenedorResumenes.innerHTML = "<p>No se encontraron resúmenes ejecutivos.</p>";
    } else {
      const htmlResumenes = `<div class="grid-informes">
        ${resumenesEjecutivos.map(doc => `
          <div class="tarjeta-informe">
            <a href="../?doc=${doc.slug}">
              <img src="${doc.portada}" alt="Portada de ${doc.titulo}">
              <h3>${doc.titulo}</h3>
            </a>
          </div>
        `).join("")}
      </div>`;
      contenedorResumenes.innerHTML = htmlResumenes;
    }

  } catch (error) {
    contenedorInformes.innerHTML = `<p>Error al cargar los informes anuales.</p>`;
    contenedorResumenes.innerHTML = `<p>Error al cargar los resúmenes ejecutivos.</p>`;
  }
}

cargarInformesAnuales();