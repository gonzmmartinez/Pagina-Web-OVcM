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

// ====== FUNCIÓN PARA RECORTAR TEXTO ======
function recortarTexto(texto, max = 150) {
  if (texto.length <= max) return texto;
  return texto.substring(0, max).trim() + "...";
}

// ====== GENERADOR DE TARJETAS ======
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("directorio-container");

  fetch("./directoras.json")
    .then(response => response.json())
    .then(directoras => {

      directoras.forEach(dir => {

        const card = document.createElement("div");
        card.classList.add("directora-card");

        // Datos para el modal
        card.dataset.nombre = dir.nombre;
        card.dataset.img = dir.img;
        card.dataset.desc = dir.descripcion;

        // Crear descripción breve automáticamente
        const breve = recortarTexto(dir.descripcion, 150);

        card.innerHTML = `
                    <img src="${dir.img}" class="directora-img" alt="${dir.nombre}">
                    <h3 class="directora-nombre">${dir.nombre}</h3>
                    <p class="directora-desc">${breve}</p>
                `;

        contenedor.appendChild(card);
      });

      document.dispatchEvent(new Event("tarjetas-cargadas"));
    });
});
