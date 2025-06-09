// Datos
const archivo1_8 = "../datos/json/femicidios_causas_totales.json";

// PROCESAMIENTO
function procesarDatos1_8(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories1_8 = [];
    const values1_8 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories1_8.push(item.Estado);
        values1_8.push(item.Cantidad);            
    });

    return { categories1_8, values1_8 };
}

// INICIALIZACIÓN
function iniciar1_8() {
  cargarDatos(archivo1_8) // Cargar los datos del JSON
        .then(data1_8 => {
            // Parsear los datos
            const parsedData1_8 = parsearDatos(data1_8);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado1_8 = "2025";
            const datosFiltrados1_8 = filtrarPorAnio(parsedData1_8, anioSeleccionado1_8);

            // Procesar los datos filtrados
            const { categories1_8, values1_8 } = procesarDatos1_8(datosFiltrados1_8);

            // Crear y renderizar el gráfico
            window.chart1_8 = crearGrafico1_8(categories1_8, values1_8);
            window.chart1_8.render();

            // Calcular total
            const total = values1_8.reduce((a, b) => a + b, 0);

            document.getElementById("totalMuertes").innerText = `${total}`;
        })
        .catch(error1 => {
            document.getElementById("grafico1_8").textContent = `Error: ${error1.message}`;
        });
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
  return data.filter(item => item.Año === year);
}

function actualizarGrafico1_8() {
  cargarDatos(archivo1_8)
      .then(data1_8 => {
          const parsedData1_8 = parsearDatos(data1_8);

          // Filtrar por el distrito seleccionado
          const anioSeleccionado1_8 = document.getElementById("Anio1").value;
          const datosFiltrados1_8 = filtrarPorAnio(parsedData1_8, anioSeleccionado1_8);

          // Procesar datos
          const { categories1_8, values1_8 } = procesarDatos1_8(datosFiltrados1_8);

          // Actualizar las series y categorías con animación
          window.chart1_8.updateOptions({
            ...window.chart1_8.w.config, // Copia las opciones actuales
            series: [...values1_8],
            labels: [...categories1_8]
          });

          // Calcular total
          const total = values1_8.reduce((a, b) => a + b, 0);

          document.getElementById("totalMuertes").innerText = `${total}`;
      })
      .catch(error => {
          document.getElementById("grafico1_8").textContent = `Error: ${error.message}`;
      });
}

// 5. Función para configurar y renderizar el gráfico
function crearGrafico1_8(categories, values) {
  return new ApexCharts(document.querySelector("#grafico1_8"), {
      chart: {
          type: 'donut',
          height: '100%',
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
        fontSize: '10px',
        formatter: function(seriesName, opts) {
          // Recortar texto de la leyenda a 30 caracteres y unir las líneas con un salto de línea
          const lineas = cortarTexto(seriesName, 30);
          return lineas.join("<br>"); // Usa "<br>" para saltos de línea en HTML
        },
        useHtml: true // Permitir HTML en la leyenda
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