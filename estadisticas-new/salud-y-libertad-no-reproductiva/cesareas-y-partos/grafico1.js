// Datos
const archivo1 = "../../datos/json/salud_partos_departamento.json";

// PROCESAMIENTO
function procesarDatos1(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories1 = [];
    const values1 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories1.push(item.Departamento);
        values1.push(item.Cantidad);            
    });

    return { categories1, values1 };
};

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
};

// INICIALIZACIÓN
function iniciar1() {
  cargarDatos(archivo1) // Cargar los datos del JSON
        .then(data1 => {
            // Parsear los datos
            const parsedData1 = parsearDatos(data1);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado1 = "2023";
            const datosFiltrados1 = filtrarPorAnio(parsedData1, anioSeleccionado1);

            // Procesar los datos filtrados
            const { categories1, values1 } = procesarDatos1(datosFiltrados1);

            // Crear y renderizar el gráfico
            window.chart1 = crearGrafico1(categories1, values1);
            window.chart1.render();
        })
        .catch(error1 => {
            document.getElementById("grafico1").textContent = `Error: ${error1.message}`;
        });
};

function actualizarGrafico1() {
  cargarDatos(archivo1)
      .then(data1 => {
        const parsedData1 = parsearDatos(data1);

        // Filtrar por el distrito seleccionado
        const anioSeleccionado1 = document.getElementById("Anio1").value;
        const datosFiltrados1 = filtrarPorAnio(parsedData1, anioSeleccionado1);

        // Procesar datos
        const { categories1, values1 } = procesarDatos1(datosFiltrados1);

        // Actualizar las series y categorías con animación
        window.chart1.updateOptions({
            ...window.chart1.w.config, // Copia las opciones actuales
            series: [{data: [...values1]}],
            xaxis: { categories: [...categories1]
            }
        });
      })
      .catch(error => {
          document.getElementById("grafico1").textContent = `Error: ${error.message}`;
      });
};

// 5. Función para configurar y renderizar el gráfico
function crearGrafico1(categories, values) {
    return new ApexCharts(document.querySelector("#grafico1"), {
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
        colors: ["#e3753d", "#a9a226", "#e3474b", "#e3753d", "#e3a22e", "#1468b1", "#45488d"],
        yaxis: {
            title: {
                text: "Cantidad"
            }
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