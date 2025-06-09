// ESTADO INICIAL DE LA BARRA LATERAL
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleButton = document.getElementById('toggleSidebar');
    const collapsedLogo = document.getElementById('collapsedLogo');
    const collapsedText = document.getElementById('collapsedText');

    // Verifica si estamos en un dispositivo móvil
    const isMobile = window.innerWidth <= 800;

    // Estado inicial de la barra según el dispositivo
    if (isMobile) {
        sidebar.classList.add('collapsed'); // Oculta parcialmente la barra en móviles
        toggleButton.style.color = '#fafafa'; // Color del botón cuando la barra está oculta
        collapsedLogo.classList.remove('hidden'); // Muestra el logo colapsado
        collapsedText.classList.remove('hidden');
    } else {
        sidebar.classList.remove('collapsed'); // Muestra la barra en escritorio
        mainContent.classList.remove('expanded'); // Restaura el contenido principal
        collapsedLogo.classList.add('hidden'); // Oculta el logo colapsado
        collapsedText.classList.add('hidden');
    }
});

// BOTÓN DE ABRIR LA BARRA LATERAL
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleButton = document.getElementById('toggleSidebar');
    const collapsedLogo = document.getElementById('collapsedLogo');
    const collapsedText = document.getElementById('collapsedText');

    // Alterna la visibilidad de la barra lateral
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');

    // Ajusta la posición y color del botón según el estado de la barra lateral
    const isMobile = window.innerWidth <= 800;

    if (isMobile) {
        toggleButton.style.color = '#fafafa';
        // Muestra u oculta collapsedLogo y collapsedText solo en dispositivos móviles
        collapsedLogo.classList.toggle('hidden');
        collapsedText.classList.toggle('hidden');
    } else {
        toggleButton.style.left = sidebar.classList.contains('collapsed') ? '1.25%' : '15%';
        // Asegúrate de que collapsedLogo y collapsedText siempre estén ocultos en escritorio
        collapsedLogo.classList.add('hidden');
        collapsedText.classList.add('hidden');
    }
}

// FUNCIÓN PARA CAMBIAR DE GRÁFICOS
function showChart(chartId) {
    // Ocultar todos los gráficos
    document.querySelectorAll(".chartContent").forEach(chart => {
        chart.classList.remove("active");
    });

    // Mostrar el gráfico seleccionado
    document.getElementById(chartId).classList.add("active");

    // Destruir TODOS los gráficos existentes
    document.querySelectorAll('[id^="chart"]').forEach((chartElement) => {
        const chartId = chartElement.id;  // Obtener el id del gráfico
        if (window[chartId] && typeof window[chartId].destroy === 'function') {
            window[chartId].destroy();  // Destruir el gráfico si existe
            window[chartId] = null;  // Eliminar la referencia
        }
    });

    // Actualizar los botones (quitar 'active' de todos y añadirlo al botón clicado)
    document.querySelectorAll(".indicadorButton").forEach(button => {
        button.classList.remove("active");
    });

    // Añadir 'active' al botón que llamó a la función
    const activeButton = document.querySelector(`button[onclick="showChart('${chartId}')"]`);
    if (activeButton) {
        activeButton.classList.add("active");
    }

    // Extraer el número del id y generar la función dinamicamente
    const chartNumber = chartId.replace('chart', '');  // Extraemos el número del id (por ejemplo '1' de 'chart1')
    const initFunction = `iniciar${chartNumber}`;  // Crear el nombre de la función (por ejemplo 'iniciar1')

    // Llamar a la función correspondiente
    if (typeof window[initFunction] === 'function') {
        window[initFunction]();  // Llamamos dinámicamente la función
    }
}

// FUNCIÓN SOBRE LOS GRÁFICOS

// Función para hacer el fetch
function cargarDatos(archivo) {
    return fetch(archivo) // Ruta al archivo JSON
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar JSON: ${response.status}`);
            }
            return response.json();
        });
}

// Función para parsear
function parsearDatos(data) {
    let parsedData;
    if (Array.isArray(data) && typeof data[0] === "string") {
        // Si es un array con un string JSON, realiza el segundo parseo
        parsedData = JSON.parse(data[0]);
    } else {
        // Si el JSON ya está bien estructurado, no es necesario el parseo adicional
        parsedData = data;
    }
    return parsedData;
}

// -------------------------

// Get the button:
let mybutton = document.getElementById("botonTop");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    $('html, body').animate({ scrollTop: 0 }, 250); // Desplazamiento suave al inicio
  }
  
  // Evento para los enlaces con desplazamiento suave
  $('a').click(function() {
    const target = $($(this).attr('href'));
    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 250);
    }
    return false;
  });

// FUNCIÓN PARA GUARDAR EL DIV COMO PNG
function guardarActivoComoPNG() {
    const chartActivo = document.querySelector('.chartContent.active');

    if (chartActivo) {
        // Tratamos los elementos SVG antes de capturarlos con html2canvas
        var svgElements = chartActivo.querySelectorAll('svg');
        svgElements.forEach(function(item) {
            // Establecer explícitamente los atributos width y height del SVG
            item.setAttribute("width", item.getBoundingClientRect().width);
            item.setAttribute("height", item.getBoundingClientRect().height);
            
            // Limpiar cualquier estilo previo de width y height
            item.style.width = null;
            item.style.height = null;
        });

        // Usamos html2canvas para capturar el contenido del div activo
        html2canvas(chartActivo, {
            scale: 3, // Aumenta la escala para una mejor calidad
            allowTaint: true, // Permite capturar imágenes externas
            useCORS: true, // Soporta CORS
            backgroundColor: null, // Asegura que se capturen los fondos como están
            logging: true, // Habilita el log para depuración
            x: 0, // Posición en el eje X para la captura
            y: 0, // Posición en el eje Y para la captura
            width: chartActivo.offsetWidth, // El ancho del div a capturar
            height: chartActivo.offsetHeight // El alto del div a capturar
        }).then((canvas) => {
            // Creamos un enlace para descargar la imagen
            const enlace = document.createElement('a');
            enlace.download = 'grafico_ovcm.png';
            
            // Convertimos el canvas a una imagen en formato PNG
            enlace.href = canvas.toDataURL('image/png');

            // Aseguramos que el navegador permita la descarga
            document.body.appendChild(enlace);  // Añadimos el enlace al DOM temporalmente
            enlace.click(); // Simulamos el click
            document.body.removeChild(enlace);  // Eliminamos el enlace después de hacer clic
        }).catch((error) => {
            console.error('Error al capturar el gráfico:', error);
            alert('Hubo un problema al guardar el gráfico.');
        });
    } else {
        alert('No hay gráfico activo.');
    }
}