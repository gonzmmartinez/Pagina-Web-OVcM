// Datos
const archivo5 = "../../datos/json/denuncias_911_hora.json";

// PROCESAMIENTO
function procesarDatos5(data) {
    // Inicializar un objeto para organizar los datos por meses
    const mesesAgrupados = {};

    // Iterar sobre los datos para organizarlos
    data.forEach(({ Mes, Hora, Cantidad }) => {
        if (!mesesAgrupados[Mes]) {
            mesesAgrupados[Mes] = [];
        }
        mesesAgrupados[Mes].push({ x: Hora, y: Cantidad });
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
function iniciar5() {
  cargarDatos(archivo5) // Cargar los datos del JSON
        .then(data5 => {
            // Parsear los datos
            const parsedData5 = parsearDatos(data5);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado5 = "2024";
            const datosFiltrados5 = filtrarPorAnio(parsedData5, anioSeleccionado5);

            // Procesar los datos filtrados
            const series5 = procesarDatos5(datosFiltrados5);

            // Crear y renderizar el gráfico
            window.chart5 = crearGrafico5(series5);
            window.chart5.render();
        })
        .catch(error1 => {
            document.getElementById("grafico5").textContent = `Error: ${error1.message}`;
        });
};

function actualizarGrafico5() {
  cargarDatos(archivo5)
      .then(data5 => {
        const parsedData5 = parsearDatos(data5);

        // Filtrar por el distrito seleccionado
        const anioSeleccionado5 = document.getElementById("Anio5").value;
        const datosFiltrados5 = filtrarPorAnio(parsedData5, anioSeleccionado5);

        // Procesar datos
        const series5  = procesarDatos5(datosFiltrados5);

        // Actualizar las series y categorías con animación
        window.chart5.updateOptions({
            ...window.chart5.w.config, // Copia las opciones actuales
            series: [...series5]
        })
      })
      .catch(error => {
          document.getElementById("grafico5").textContent = `Error: ${error.message}`;
      });
};

// 5. Función para configurar y renderizar el gráfico
function crearGrafico5(series) {
    return new ApexCharts(document.querySelector("#grafico5"), {
        chart: {
            type: 'heatmap',
            height: '500px',
            toolbar: {
              show: false
            }
        },
        series: series,
        title: {},
        colors: ["#1468b1"],
        yaxis: {
            title: {
                text: "Mes"
            }
        },
        xaxis: {
            title: {
                text: "Hora"
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
                fontSize: '0.5rem'
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