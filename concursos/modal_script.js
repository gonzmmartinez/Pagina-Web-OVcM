// Datos de cada concurso
const concursos = {
    'concurso-tesis-2026': {
        titulo: 'Concurso de Tesis de Grado con Perspectiva de Género 2026',
        descripcion: `
        <strong style="color:#51c33b">CONVOCATORIA ABIERTA</strong><br><br><br>
      🟣 <strong>El Observatorio de Violencia contra las Mujeres</strong> invita a estudiantes y graduadxs a participar del Concurso de Tesis 2026.<br><br>
      🟣 Esta convocatoria busca fomentar la investigación con perspectiva de género en distintas disciplinas.<br><br>
      🟣 <strong>Postulaciones:</strong> del 19/05/2026 al 15/06/2026 vía correo a: <a href="mailto:observatoriomujersalta@gmail.com">observatoriomujersalta@gmail.com</a><br><br>
      🟣 Podés encontrar las bases completas aquí:
    `,
        pdf: 'https://ovcmsalta.gob.ar/wp-content/uploads/2026/05/BASES_ConcursoTesis_2026_.pdf',
        slug: 'concurso-tesis-2026'
    }
};

const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalLink = document.getElementById('modal-link');
const closeModal = document.querySelector('.modal-close');

// Abrir modal al hacer clic en una imagen
document.querySelectorAll('.boton-imagen').forEach(boton => {
    boton.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href').replace('./', '');
        const data = concursos[href];
        if (data) {
            modalTitle.textContent = data.titulo;
            modalDescription.innerHTML = data.descripcion;
            modalLink.href = data.pdf;
            modalOverlay.classList.remove('hidden');

            // Modificar la URL con pushState
            const newUrl = `${window.location.pathname}?concurso=${data.slug}`;
            window.history.pushState({ concurso: data.slug }, '', newUrl);
        }
    });
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

// Abrir modal automáticamente si hay un ?concurso= en la URL
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('concurso');

    if (slug) {
        // Buscar el concurso por slug
        const data = Object.values(concursos).find(c => c.slug === slug);
        if (data) {
            modalTitle.textContent = data.titulo;
            modalDescription.innerHTML = data.descripcion;
            modalLink.href = data.pdf;
            modalOverlay.classList.remove('hidden');
        }
    }
});
