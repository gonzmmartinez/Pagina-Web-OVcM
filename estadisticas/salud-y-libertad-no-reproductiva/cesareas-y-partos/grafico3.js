// Datos
const archivo3 = "../../datos/json/salud_partos_edad.json";

// PROCESAMIENTO
function procesarDatos3(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories3 = [];
    const values3 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories3.push(item.Rango_etario);
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
            const anioSeleccionado3 = "2023";
            const datosFiltrados3 = filtrarPorAnio(parsedData3, anioSeleccionado3);

            // Procesar los datos filtrados
            const { categories3, values3 } = procesarDatos3(datosFiltrados3);

            // Crear y renderizar el gráfico
            window.chart3 = crearGrafico3(categories3, values3);
            window.chart3.render();
        })
        .catch(error1 => {
            document.getElementById("grafico3").textContent = `Error: ${error1.message}`;
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
        colors: ["#1468b1", "#a9a226", "#e3474b", "#e3753d", "#e3a22e", "#45488d"],
        yaxis: {
            title: {
                text: "Cantidad"
            }
        },
        xaxis: {
            title: {
                text: "Rango etario"
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
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            },
            offsetY: -20,
            style: {
                colors: ['#000000']
            }
        }
    });
};