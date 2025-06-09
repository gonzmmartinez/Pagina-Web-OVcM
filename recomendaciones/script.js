const contenedorRecomendaciones = document.querySelector("#lista-recomendaciones");
const JSON_URL = "./lista_recomendaciones.json";

document.addEventListener('DOMContentLoaded', () => {
  // Menú hamburguesa
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.header-container .nav-links');
  const icon = menuToggle.querySelector('img');

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    icon.src = navLinks.classList.contains('open') ? './svg/close_menu.svg' : './svg/menu.svg';
    icon.style.transform = navLinks.classList.contains('open') ? 'rotate(90deg)' : 'rotate(0deg)';
  });

  // Carga de recomendaciones
  fetch(JSON_URL)
    .then(res => res.json())
    .then(data => {
      data.forEach((item, index) => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("recomendacion-tarjeta");

        // Agregar los data-* directamente a la tarjeta
        tarjeta.setAttribute("data-titulo", item.titulo);
        tarjeta.setAttribute("data-descripcion", item.descripcion);
        tarjeta.setAttribute("data-link", item.link);
        tarjeta.setAttribute("data-numero", item.numero);

        tarjeta.innerHTML = `
          <div class="recomendacion-numero">${item.numero}</div>
          <div class="recomendacion-contenido">
            <div class="recomendacion-titulo">Recomendación N° ${item.numero}</div>
            <h2>${item.titulo}</h2>
          </div>
        `;

        contenedorRecomendaciones.appendChild(tarjeta);
      });
    })
    .catch(err => {
      console.error("Error al cargar las recomendaciones:", err);
      contenedorRecomendaciones.innerHTML = "<p>Error al cargar las recomendaciones.</p>";
    });
});