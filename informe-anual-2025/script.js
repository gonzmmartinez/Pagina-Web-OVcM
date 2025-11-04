const contenedorDocumentos = document.querySelector(".documentos-muestra");
const JSON_URL = "./documentos.json";

async function cargarDocumentos() {
  try {
    const res = await fetch(JSON_URL);
    const documentos = await res.json();

    // Ordenar únicamente por el campo "orden" (maneja valores nulos/indefinidos)
    const docsOrdenados = documentos
      .slice() // evita mutar el array original por si hace falta
      .sort((a, b) => ((a.orden ?? 0) - (b.orden ?? 0)));

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

// Visibilidad de las tarjetas
const cards = document.querySelectorAll('.card');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.3 // se activa cuando el 20% de la tarjeta es visible
});

cards.forEach(card => observer.observe(card));

// SCROLL SUAVE
function scrollToElement(targetEl, duration = 2000) {
  const start = window.scrollY;
  const end = targetEl.getBoundingClientRect().top + window.scrollY;
  const distance = end - start;
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress;
    window.scrollTo(0, start + distance * ease);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    const targetId = card.getAttribute('data-target');
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      scrollToElement(targetEl, 1500); // 1500ms = 1.5 segundos
    }
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

// Evento para los enlaces con desplazamiento suave
$('a').click(function () {
  const target = $($(this).attr('href'));
  if (target.length) {
    $('html, body').animate({
      scrollTop: target.offset().top
    }, 250);
  }
  return false;
});