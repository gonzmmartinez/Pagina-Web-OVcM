// Datos
const archivo2 = "../../datos/json/salud_ive_edad.json";

// PROCESAMIENTO
function procesarDatos2(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories2 = [];
    const values2 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories2.push(item.Rango_etario_pg);
        values2.push(item.Cantidad);            
    });

    return { categories2, values2 };
};

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
};

// INICIALIZACIÓN
function iniciar2() {
  cargarDatos(archivo2) // Cargar los datos del JSON
        .then(data2 => {
            // Parsear los datos
            const parsedData2 = parsearDatos(data2);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado2 = "2023";
            const datosFiltrados2 = filtrarPorAnio(parsedData2, anioSeleccionado2);

            // Procesar los datos filtrados
            const { categories2, values2 } = procesarDatos2(datosFiltrados2);

            // Crear y renderizar el gráfico
            window.chart2 = crearGrafico2(categories2, values2);
            window.chart2.render();
        })
        .catch(error1 => {
            document.getElementById("grafico2").textContent = `Error: ${error1.message}`;
        });
};

function actualizarGrafico2() {
  cargarDatos(archivo2)
      .then(data2 => {
        const parsedData2 = parsearDatos(data2);

        // Filtrar por el distrito seleccionado
        const anioSeleccionado2 = document.getElementById("Anio2").value;
        const datosFiltrados2 = filtrarPorAnio(parsedData2, anioSeleccionado2);

        // Procesar datos
        const { categories2, values2 } = procesarDatos2(datosFiltrados2);

        // Actualizar las series y categorías con animación
        window.chart2.updateOptions({
            ...window.chart2.w.config, // Copia las opciones actuales
            series: [{data: [...values2]}],
            xaxis: { categories: [...categories2]
            }
        });
      })
      .catch(error => {
          document.getElementById("grafico2").textContent = `Error: ${error.message}`;
      });
};

// 5. Función para configurar y renderizar el gráfico
function crearGrafico2(categories, values) {
    return new ApexCharts(document.querySelector("#grafico2"), {
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
        colors: ["#a9a226", "#e3a22e", "#a9a226", "#e3474b", "#1468b1", "#45488d"],
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