const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalLink = document.getElementById('modal-link');
const modalNumero = document.getElementById('modal-numero');

const closeModal = document.querySelector('.modal-close');

// Función para abrir el modal con los datos del elemento
function abrirModalDesdeElemento(el) {
    const titulo = el.getAttribute('data-titulo');
    const descripcion = el.getAttribute('data-descripcion');
    const numero = el.getAttribute('data-numero');
    const link = el.getAttribute('data-link');

    if (!titulo || !descripcion || !link) return;

    modalTitle.textContent = titulo;
    modalDescription.innerHTML = descripcion;
    modalLink.href = link;
    modalNumero.textContent = `RECOMENDACIÓN N° ${numero}`;
    modalOverlay.classList.remove('hidden');

    // Opcional: actualizar la URL
    const slug = titulo.toLowerCase().replace(/\s+/g, '-');
    const newUrl = `${window.location.pathname}?recomendacion=${slug}`;
    window.history.pushState({ recomendacion: slug }, '', newUrl);
}

// Delegación de eventos para tarjetas y botones
document.addEventListener('click', function (e) {
    const boton = e.target.closest('.leer-mas');
    const tarjeta = e.target.closest('.recomendacion-tarjeta');

    if (boton) {
        e.preventDefault();
        abrirModalDesdeElemento(boton);
    } else if (tarjeta) {
        e.preventDefault();
        abrirModalDesdeElemento(tarjeta);
    }
});

// Cerrar modal con botón
closeModal.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
    window.history.pushState({}, '', window.location.pathname);
});

// Cerrar haciendo clic fuera del modal
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.add('hidden');
        window.history.pushState({}, '', window.location.pathname);
    }
});

// Abrir modal automáticamente si hay un ?recomendacion= en la URL
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('recomendacion');

    if (!slug) return;

    // Esperar a que las tarjetas se carguen dinámicamente
    const observer = new MutationObserver(() => {
        const elementos = document.querySelectorAll('.recomendacion-tarjeta');
        elementos.forEach(el => {
            const titulo = el.getAttribute('data-titulo');
            const generatedSlug = titulo?.toLowerCase().replace(/\s+/g, '-');
            if (generatedSlug === slug) {
                abrirModalDesdeElemento(el);
                observer.disconnect(); // solo necesitamos esto una vez
            }
        });
    });

    observer.observe(document.getElementById('lista-recomendaciones'), {
        childList: true,
        subtree: true
    });
});
