// Datos
const archivo4 = "../../datos/json/salud_ile.json";

// PROCESAMIENTO
function procesarDatos4(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories4 = [];
    const values4 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories4.push(item.Mes);
        values4.push(item.Cantidad);            
    });

    return { categories4, values4 };
};

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
            const anioSeleccionado4 = "2023";
            const datosFiltrados4 = filtrarPorAnio(parsedData4, anioSeleccionado4);

            // Procesar los datos filtrados
            const { categories4, values4 } = procesarDatos4(datosFiltrados4);

            // Crear y renderizar el gráfico
            window.chart4 = crearGrafico4(categories4, values4);
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
        const { categories4, values4 } = procesarDatos4(datosFiltrados4);

        // Actualizar las series y categorías con animación
        window.chart4.updateOptions({
            ...window.chart4.w.config, // Copia las opciones actuales
            series: [{data: [...values4]}],
            xaxis: { categories: [...categories4],
                    labels: {
                        formatter: function(value) {
                            if (value == null) {
                                return ''; // Manejo de valores no válidos
                            }
                            return value.substring(0, 3); // Procesa solo valores válidos
                        }
                    }
            }
        });
      })
      .catch(error => {
          document.getElementById("grafico4").textContent = `Error: ${error.message}`;
      });
};

// 5. Función para configurar y renderizar el gráfico
function crearGrafico4(categories, values) {
    return new ApexCharts(document.querySelector("#grafico4"), {
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
        colors: ["#e3a22e", "#a9a226", "#e3474b", "#e3753d", "#e3a22e", "#1468b1", "#45488d"],
        yaxis: {
            title: {
                text: "Cantidad"
            }
        },
        xaxis: {
            title: {
                text: "Mes"
            },
            categories: categories,
            labels: {
                formatter: function(value) {
                    if (value == null) {
                        return ''; // Manejo de valores no válidos
                    }
                    return value.substring(0, 3); // Procesa solo valores válidos
                }
            }
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
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            },
            offsetY: -20,
            style: {
                colors: ['#000000']
            }
        }
    });
};

// INICIALIZAR
window.addEventListener("load", iniciar1);