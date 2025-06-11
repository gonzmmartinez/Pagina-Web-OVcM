// Datos
const archivo1 = "../../datos/json/denuncias_sud_tipo.json";

// PROCESAMIENTO
function procesarDatos1(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories1 = [];
    const values1 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories1.push(item.Tipo);
        values1.push(item.Cantidad);            
    });

    return { categories1, values1 };
};

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
  return data.filter(item => item.Año === year);
};

// COLORES
// Función para asignar colores
function assignColors1(categories1) {
  return categories1.map(category => {
    switch (category) {
      case "Violencia familiar":
        return "#2b768a";
      case "Violencia de género":
        return "#e3474b"; 
      case "Violencia no penal":
        return "#1468b1";
      default:
        return "#CCCCCC"; // Gris por defecto
    }
  });
};

// INICIALIZACIÓN
function iniciar1() {
  cargarDatos(archivo1) // Cargar los datos del JSON
        .then(data1 => {
            // Parsear los datos
            const parsedData1 = parsearDatos(data1);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado1 = "2024";
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

          // Cambiar colores
          const colors1 = assignColors1(categories1);

          // Actualizar las series y categorías con animación
          window.chart1.updateOptions({
            ...window.chart1.w.config, // Copia las opciones actuales
            series: [...values1],
            labels: [...categories1],
            colors: [...colors1]
          });
      })
      .catch(error => {
          document.getElementById("grafico1").textContent = `Error: ${error.message}`;
      });
};

// 5. Función para configurar y renderizar el gráfico
function crearGrafico1(categories, values) {
  // Asignar colores según las categorías
  const colors = assignColors1(categories);

  return new ApexCharts(document.querySelector("#grafico1"), {
      chart: {
          type: 'donut',
          height: '350px',
          toolbar: {
            show: false
          }
      },
      series: values, // Los valores para el gráfico (arreglo de números)
      labels: categories, // Las etiquetas para cada segmento
      title: {},
      colors: colors,
      tooltip: {
        enabled: true,
        followCursor: true,
        y: {
          formatter: function(value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          }
        }
      },
      legend: {
        show: true,
        fontSize: '7.5rem',
        formatter: function(seriesName, opts) {
          return [seriesName + " - " + opts.w.globals.series[opts.seriesIndex]].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '50%',
            labels: {
              show: true,
              total: {
                show: true,
                label: "Total",
                formatter: function(w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b
                  }, 0)
                }
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          if (val >= 5) {
            return Math.round(val * 10) / 10 + "%"
          } else {
            return ''
          }
        },
        dropShadow: false,
        style: {
          fontSize: '0.8rem',
          fontWeight: 'bold',
          color: 'white'
        },
      }
  });
};

// Llamar la función principal al cargar la página
window.addEventListener("load", iniciar1);