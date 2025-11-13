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

// MOVIMIENTO DEL LOGO
const logo = document.querySelector('.logo-observatorio');
logo.addEventListener('mousemove', (e) => {
  const rect = logo.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * 15;
  const rotateY = ((x - centerX) / centerX) * 15;

  logo.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.15)`;
});

logo.addEventListener('mouseleave', () => {
  logo.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
});

// BOTÓN PARA SUBIR
let mybutton = document.getElementById("botonTop");
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
function topFunction() {
  $('html, body').animate({ scrollTop: 0 }, 250);
}

// Visibilidad de las tarjetas
const cards = document.querySelectorAll('.card-mvv');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.3 // se activa cuando el 30% de la tarjeta es visible
});

cards.forEach(card => observer.observe(card));

// CARROUSEL DE IMAGENES
fetch("https://ovcmsalta.gob.ar/wp-json/wp/v2/posts?categories=20&per_page=15&_embed")
  .then(res => res.json())
  .then(posts => {
    const container = document.getElementById("novedades-container");

    posts.forEach(post => {
      const img = post.og_image?.[0]?.url || post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
      if (img) {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.innerHTML = `<img src="${img}" alt="${post.title.rendered}">`;
        container.appendChild(slide);
      }
    });

    // Inicializar Swiper después de cargar las imágenes
    new Swiper(".novedades-swiper", {
      loop: true,
      centeredSlides: true,
      slidesPerView: 'auto', // IMPORTANT: allow CSS width control
      slideToClickedSlide: true,
      spaceBetween: 40,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      speed: 700,
    });

  })
  .catch(err => console.error("Error al cargar las novedades:", err));
