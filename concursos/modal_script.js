// Datos de cada concurso
const concursos = {
    'concurso-tesis-2025': {
        titulo: 'Concurso de Tesis de Grado con Perspectiva de Género 2025',
        descripcion: `
        <strong style="color:#51c33b">CONVOCATORIA FINALIZADA</strong><br><br><br>
      🟣 <strong>El Observatorio de Violencia contra las Mujeres</strong> invita a estudiantes y graduadxs a participar del Concurso de Tesis 2025.<br><br>
      🟣 Esta convocatoria busca fomentar la investigación con perspectiva de género en distintas disciplinas.<br><br>
      🟣 <strong>Postulaciones:</strong> del 30/04/2025 al 30/05/2025 vía correo a: <a href="mailto:observatoriomujersalta@gmail.com">observatoriomujersalta@gmail.com</a><br><br>
      🟣 Podés encontrar las bases completas aquí:
    `,
        pdf: 'https://ovcmsalta.gob.ar/wp-content/uploads/2025/04/BASES_ConcursoTesis_2025_.pdf',
        slug: 'tesis-de-grado-2025'
    },
    'concurso-diseno-2025': {
        titulo: 'Concurso de Diseño con Perspectiva de Género 2025',
        descripcion: `
        <strong style="color:#51c33b">CONVOCATORIA FINALIZADA</strong><br><br><br>
      🟣 <strong>El Observatorio de Violencia contra las Mujeres</strong> invita a estudiantes y graduadxs a postularse al Concurso de Diseño con Perspectiva de Género en la Provincia de Salta, edición 2025.<br><br>
      🟣 Esta convocatoria tiene por objetivo invitar a profesionales a transversalizar la perspectiva de género en sus ámbitos de competencia, ya que es un papel importante el que cumple la comunicación y la producción visual a la hora de remover los estereotipos de género y prevenir violencias simbólicas.<br><br>
      🟣 <strong>Postulaciones:</strong> del 01/07/2025 al 18/07/2025 vía correo a: <a href="mailto:observatoriomujersalta@gmail.com">observatoriomujersalta@gmail.com</a><br><br>
      🟣 Podés encontrar los requisitos de presentación y proceso de selección aquí:
    `,
        pdf: 'https://ovcmsalta.gob.ar/wp-content/uploads/2025/05/Bases-Concurso-de-Diseno-2025.pdf',
        slug: 'tesis-de-diseno-2025'
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
