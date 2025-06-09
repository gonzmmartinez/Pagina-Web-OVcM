// Datos
const archivo6 = "../../datos/json/denuncias_ovfg_genero_denunciado.json";

// PROCESAMIENTO
function procesarDatos6(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories6 = [];
    const values6 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories6.push(item.Género);
        values6.push(item.Porcentaje);            
    });

    return { categories6, values6 };
}

// INICIALIZACIÓN
function iniciar6() {
  cargarDatos(archivo6) // Cargar los datos del JSON
        .then(data6 => {
            // Parsear los datos
            const parsedData6 = parsearDatos(data6);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado6 = "TODOS";
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
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
  return data.filter(item => item.Año === year);
}

function actualizarGrafico6() {
  cargarDatos(archivo6)
      .then(data6 => {
          const parsedData6 = parsearDatos(data6);

          // Filtrar por el distrito seleccionado
          const anioSeleccionado6 = document.getElementById("Anio6").value;
          const datosFiltrados6 = filtrarPorAnio(parsedData6, anioSeleccionado6);

          // Procesar datos
          const { categories6, values6 } = procesarDatos6(datosFiltrados6);

          // Cambiar colores
          const colors6 = assignColors5(categories6);

          // Actualizar las series y categorías con animación
          window.chart6.updateOptions({
            ...window.chart6.w.config, // Copia las opciones actuales
            series: [...values6],
            labels: [...categories6],
            colors: [...colors6]
          });
      })
      .catch(error => {
          document.getElementById("grafico6").textContent = `Error: ${error.message}`;
      });
}

// 5. Función para configurar y renderizar el gráfico
function crearGrafico6(categories, values) {
  // Cambiar colores
  const colors = assignColors5(categories);

  return new ApexCharts(document.querySelector("#grafico6"), {
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
          formatter: function(val) {
            return Math.round(val * 10) / 10 + '%';
          }
      },
      },
      legend: {
        show: true,
        fontSize: '7.5rem',
        formatter: function(seriesName, opts) {
          return [seriesName + " - " + Math.round(opts.w.globals.series[opts.seriesIndex] * 10) / 10 + '%']
        }
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
}