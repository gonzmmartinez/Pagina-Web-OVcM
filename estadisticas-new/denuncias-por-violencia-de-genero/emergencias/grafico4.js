// Datos
const archivo4 = "../../datos/json/denuncias_911_dia.json";

// PROCESAMIENTO
function procesarDatos4(data) {
    // Inicializar un objeto para organizar los datos por meses
    const mesesAgrupados = {};

    // Iterar sobre los datos para organizarlos
    data.forEach(({ Mes, Dia, Cantidad }) => {
        if (!mesesAgrupados[Mes]) {
            mesesAgrupados[Mes] = [];
        }
        mesesAgrupados[Mes].push({ x: Dia, y: Cantidad });
    });

    // Convertir el objeto organizado en el formato solicitado
    const series = Object.keys(mesesAgrupados).map(mes => ({
        name: mes,
        data: mesesAgrupados[mes]
    }));

    return series ;
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
};

// INICIALIZACIÓN
function iniciar4() {
  cargarDatos(archivo4) // Cargar los datos del JSON
        .then(data4 => {
            // Parsear los datos
            const parsedData4 = parsearDatos(data4);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado4 = "2024";
            const datosFiltrados4 = filtrarPorAnio(parsedData4, anioSeleccionado4);

            // Procesar los datos filtrados
            const series4 = procesarDatos4(datosFiltrados4);

            // Crear y renderizar el gráfico
            window.chart4 = crearGrafico4(series4);
            window.chart4.render();
        })
        .catch(error1 => {
            document.getElementById("grafico4").textContent = `Error: ${error1.message}`;
        });
};

function actualizarGrafico4() {
  cargarDatos(archivo4)
      .then(data4 => {
        const parsedData4 = parsearDatos(data4);

        // Filtrar por el distrito seleccionado
        const anioSeleccionado4 = document.getElementById("Anio4").value;
        const datosFiltrados4 = filtrarPorAnio(parsedData4, anioSeleccionado4);

        // Procesar datos
        const series4  = procesarDatos4(datosFiltrados4);

        // Actualizar las series y categorías con animación
        window.chart4.updateOptions({
            ...window.chart4.w.config, // Copia las opciones actuales
            series: [...series4]
        })
      })
      .catch(error => {
          document.getElementById("grafico4").textContent = `Error: ${error.message}`;
      });
};

// 5. Función para configurar y renderizar el gráfico
function crearGrafico4(series) {
    return new ApexCharts(document.querySelector("#grafico4"), {
        chart: {
            type: 'heatmap',
            height: '500px',
            toolbar: {
              show: false
            }
        },
        series: series,
        title: {},
        colors: ["#45488d"],
        yaxis: {
            title: {
                text: "Mes"
            }
        },
        xaxis: {
            title: {
                text: "Día"
            }
        },
        tooltip: {
            enabled: true,
            followCursor: true,
            y: {
                formatter: function(value) {
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " requerimientos";
                }
            }
        },
        legend: {
            enabled: true
        },
        dataLabels: {
            enabled: true,
            offsetY: 1,
            style: {
                fontSize: '0.75rem'
            },
            formatter: function(value) {
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
        },
        plotOptions: {
            heatmap: {
                colorScale: {
                  min: 0,
                  max: 1000
                },        
            }
        }
    });
};