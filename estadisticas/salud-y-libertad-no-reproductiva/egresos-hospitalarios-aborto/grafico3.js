// Datos
const archivo3 = "../../datos/json/salud_abortos_departamentos.json";

// PROCESAMIENTO
function procesarDatos3(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories3 = [];
    const values3 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories3.push(item.Departamento);
        values3.push(item.Cantidad);            
    });

    return { categories3, values3 };
};

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
};

// INICIALIZACIÓN
function iniciar3() {
  cargarDatos(archivo3) // Cargar los datos del JSON
        .then(data3 => {
            // Parsear los datos
            const parsedData3 = parsearDatos(data3);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado3 = "2025";
            const datosFiltrados3 = filtrarPorAnio(parsedData3, anioSeleccionado3);

            // Procesar los datos filtrados
            const { categories3, values3 } = procesarDatos3(datosFiltrados3);

            document.getElementById("subtitulo_chart3").innerHTML =
                `<i>${cambiarSubtitulo3(anioSeleccionado3)}</i>`;

            // Crear y renderizar el gráfico
            window.chart3 = crearGrafico3(categories3, values3);
            window.chart3.render();
        })
        .catch(error3 => {
            document.getElementById("grafico3").textContent = `Error: ${error3.message}`;
        });
};

function actualizarGrafico3() {
  cargarDatos(archivo3)
      .then(data3 => {
        const parsedData3 = parsearDatos(data3);

        // Filtrar por el distrito seleccionado
        const anioSeleccionado3 = document.getElementById("Anio3").value;
        const datosFiltrados3 = filtrarPorAnio(parsedData3, anioSeleccionado3);

        // Procesar datos
        const { categories3, values3 } = procesarDatos3(datosFiltrados3);

        document.getElementById("subtitulo_chart3").innerHTML =
                `<i>${cambiarSubtitulo3(anioSeleccionado3)}</i>`;

        // Actualizar las series y categorías con animación
        window.chart3.updateOptions({
            ...window.chart3.w.config, // Copia las opciones actuales
            series: [{data: [...values3]}],
            xaxis: { categories: [...categories3]
            }
        });
      })
      .catch(error => {
          document.getElementById("grafico3").textContent = `Error: ${error.message}`;
      });
};

// 5. Función para configurar y renderizar el gráfico
function crearGrafico3(categories, values) {
    return new ApexCharts(document.querySelector("#grafico3"), {
        chart: {
            type: 'bar',
            height: '350px',
            toolbar: {
              show: false
            }
        },
        series: [{
            name: 'Cantidad',
            type: 'bar',
            data: values
        }],
        title: {},
        colors: ["#e3474b", "#a9a226", "#e3474b", "#e3753d", "#e3a22e", "#1468b1", "#45488d"],
        yaxis: {
            title: {
                text: "Cantidad"
            },
            labels: {
                formatter: function (value) {
                    return value.toLocaleString("es-AR");
                }
            },
            max: 1100
        },
        xaxis: {
            title: {
                text: "Departamento"
            },
            categories: categories
        },
        tooltip: {
            enabled: true,
            followCursor: true,
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    position: 'top'
                }
            }
        },
        dataLabels: {
            enabled: true, 
            formatter: function(value) {
                return value.toLocaleString("es-AR");
            },
            offsetY: -20,
            style: {
                colors: ['#000000']
            }
        }
    });
};

// Función para actualizar dinámicamente el subtítulo
function cambiarSubtitulo3(anio) {
    let texto = "Por departamento. Provincia de Salta.";

    if (anio) {
        texto += ` Año ${anio}`;
    }

    return texto;
};