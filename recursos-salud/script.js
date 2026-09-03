const contenedor_1 = document.querySelector(".documentos-muestra"); 
const contenedor_2 = document.querySelector(".documentos-muestra-2"); 
const JSON_URL = "./documentos.json"; 
 
async function cargar_1() { 
  try { 
    const res = await fetch(JSON_URL); 
    const documentos = await res.json(); 
 
    // Filtrar y ordenar documentos tipo Recursos
    const documentos_1 = documentos 
      .filter(doc => { 
        if (Array.isArray(doc.tipo_documento)) { 
          return doc.tipo_documento.includes("Recursos"); 
        } 
        return doc.tipo_documento === "Recursos"; 
      }) 
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); 
 
    if (documentos_1.length === 0) { 
      contenedor_1.innerHTML = "<p>No se encontraron documentos.</p>"; 
    } else { 
      const html = `<div class="grid-informes"> 
        ${documentos_1.map(doc => { 
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
      contenedor_1.innerHTML = html; 
    } 
 
  } catch (error) { 
    contenedor_1.innerHTML = `<p>Error al cargar los documentos.</p>`; 
    console.error("Error al cargar documentos:", error); 
  } 
}; 
 
async function cargar_2() { 
  try { 
    const res = await fetch(JSON_URL); 
    const documentos = await res.json(); 
 
    const documentos_2 = documentos 
      .filter(doc => { 
        if (Array.isArray(doc.tipo_documento)) { 
          return doc.tipo_documento.includes("Normativa"); 
        } 
        return doc.tipo_documento === "Normativa"; 
      }) 
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); 
 
    if (documentos_2.length === 0) { 
      contenedor_2.innerHTML = "<p>No se encontraron documentos de normativas.</p>"; 
    } else { 
      const html = `<div class="grid-informes"> 
        ${documentos_2.map(doc => { 
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
      contenedor_2.innerHTML = html; 
    } 
 
  } catch (error) { 
    contenedor_2.innerHTML = `<p>Error al cargar los documentos.</p>`; 
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
 
cargar_1(); 
cargar_2();