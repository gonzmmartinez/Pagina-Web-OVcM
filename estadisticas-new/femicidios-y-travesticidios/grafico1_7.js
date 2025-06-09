// Datos
const archivo1_7 = "../datos/json/femicidios_vinculo.json";

// PROCESAMIENTO
function procesarDatos1_7(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories1_7 = [];
    const values1_7 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories1_7.push(item.Vinculo);
        values1_7.push(item.Cantidad);            
    });

    return { categories1_7, values1_7 };
}

// INICIALIZACIÓN
function iniciar1_7() {
  cargarDatos(archivo1_7) // Cargar los datos del JSON
        .then(data1_7 => {
            // Parsear los datos
            const parsedData1_7 = parsearDatos(data1_7);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado1_7 = "2025";
            const datosFiltrados1_7 = filtrarPorAnio(parsedData1_7, anioSeleccionado1_7);

            // Procesar los datos filtrados
            const { categories1_7, values1_7 } = procesarDatos1_7(datosFiltrados1_7);

            // Crear y renderizar el gráfico
            window.chart1_7 = crearGrafico1_7(categories1_7, values1_7);
            window.chart1_7.render();
        })
        .catch(error1 => {
            document.getElementById("grafico1_7").textContent = `Error: ${error1.message}`;
        });
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
  return data.filter(item => item.Año === year);
}

function actualizarGrafico1_7() {
  cargarDatos(archivo1_7)
      .then(data1_7 => {
          const parsedData1_7 = parsearDatos(data1_7);

          // Filtrar por el distrito seleccionado
          const anioSeleccionado1_7 = document.getElementById("Anio1").value;
          const datosFiltrados1_7 = filtrarPorAnio(parsedData1_7, anioSeleccionado1_7);

          // Procesar datos
          const { categories1_7, values1_7 } = procesarDatos1_7(datosFiltrados1_7);

          // Actualizar las series y categorías con animación
          window.chart1_7.updateOptions({
            ...window.chart1_7.w.config, // Copia las opciones actuales
            series: [...values1_7],
            labels: [...categories1_7]
          });
      })
      .catch(error => {
          document.getElementById("grafico1_7").textContent = `Error: ${error.message}`;
      });
}

// 5. Función para configurar y renderizar el gráfico
function crearGrafico1_7(categories, values) {
  return new ApexCharts(document.querySelector("#grafico1_7"), {
      chart: {
          type: 'donut',
          height: '80%',
          toolbar: {
            show: false
          }
      },
      series: values, // Los valores para el gráfico (arreglo de números)
      labels: categories, // Las etiquetas para cada segmento
      title: {},
      colors: ["#e3753d", "#45488d", "#e3a22e", "#a9a226", "#2b768a", "#1468b1", "#e3474b"],
      dataLabels: {
        enabled: false,
        style: {
          fontSize: '8px'
        }
      },
      tooltip: {
        y: {
          formatter: function(value, opts) {
                return value + "  (" + Math.round(opts.globals.seriesPercent[opts.seriesIndex] * 10) / 10 + "%)"
          },
          title: (seriesName) => seriesName
        },
      },
      legend: {
        show: true,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '30%'
          }
        }
      },
      dataLabels: {
        enabled: true,
        dropShadow: false,
        style: {
          fontSize: '0.5rem',
          fontWeight: 'bold',
          color: 'white'
        },
      }
  });
}