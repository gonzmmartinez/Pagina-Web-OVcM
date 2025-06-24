// Datos
const archivo6 = "../../datos/json/salud_ile_semanas.json";

// PROCESAMIENTO
function procesarDatos6(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories6 = [];
    const values6 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories6.push(item.Semanas);
        values6.push(item.Cantidad);            
    });

    return { categories6, values6 };
};

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
};

// INICIALIZACIÓN
function iniciar6() {
  cargarDatos(archivo6) // Cargar los datos del JSON
        .then(data6 => {
            // Parsear los datos
            const parsedData6 = parsearDatos(data6);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado6 = "2024";
            const datosFiltrados6 = filtrarPorAnio(parsedData6, anioSeleccionado6);

            // Procesar los datos filtrados
            const { categories6, values6 } = procesarDatos6(datosFiltrados6);

            // Crear y renderizar el gráfico
            window.chart6 = crearGrafico6(categories6, values6);
            window.chart6.render();
        })
        .catch(error1 => {
            document.getElementById("grafico6").textContent = `Error: ${error1.message}`;
        });
};

function actualizarGrafico6() {
  cargarDatos(archivo6)
      .then(data6 => {
        const parsedData6 = parsearDatos(data6);

        // Filtrar por el distrito seleccionado
        const anioSeleccionado6 = document.getElementById("Anio6").value;
        const datosFiltrados6 = filtrarPorAnio(parsedData6, anioSeleccionado6);

        // Procesar datos
        const { categories6, values6 } = procesarDatos6(datosFiltrados6);

        // Actualizar las series y categorías con animación
        window.chart6.updateOptions({
            ...window.chart6.w.config, // Copia las opciones actuales
            series: [{data: [...values6]}],
            xaxis: { categories: [...categories6]
            }
        });
      })
      .catch(error => {
          document.getElementById("grafico6").textContent = `Error: ${error.message}`;
      });
};

// 5. Función para configurar y renderizar el gráfico
function crearGrafico6(categories, values) {
    return new ApexCharts(document.querySelector("#grafico6"), {
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
        colors: ["#e3a22e", "#e3a22e", "#a9a226", "#e3474b", "#45488d"],
        yaxis: {
            title: {
                text: "Cantidad"
            }
        },
        xaxis: {
            title: {
                text: "Semanas de gestación"
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