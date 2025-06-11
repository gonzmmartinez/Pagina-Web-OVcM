// Datos
const archivo5 = "../../datos/json/denuncias_ovfg_genero_denunciante.json";

// PROCESAMIENTO
function procesarDatos5(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories5 = [];
    const values5 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories5.push(item.Género);
        values5.push(item.Porcentaje);            
    });

    return { categories5, values5 };
}

// COLORES
// Función para asignar colores
function assignColors5(categories5) {
  return categories5.map(category => {
    switch (category) {
      case "Mujeres":
        return "#e3753d";
      case "Varones":
        return "#45488d";
      default:
        return "#CCCCCC"; // Gris por defecto
    }
  });
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
  return data.filter(item => item.Año === year);
}

// INICIALIZACIÓN
function iniciar5() {
  cargarDatos(archivo5) // Cargar los datos del JSON
        .then(data5 => {
            // Parsear los datos
            const parsedData5 = parsearDatos(data5);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado5 = "TODOS";
            const datosFiltrados5 = filtrarPorAnio(parsedData5, anioSeleccionado5);

            // Procesar los datos filtrados
            const { categories5, values5 } = procesarDatos5(datosFiltrados5);

            // Crear y renderizar el gráfico
            window.chart5 = crearGrafico5(categories5, values5);
            window.chart5.render();
        })
        .catch(error1 => {
            document.getElementById("grafico5").textContent = `Error: ${error1.message}`;
        });
}

function actualizarGrafico5() {
  cargarDatos(archivo5)
      .then(data5 => {
          const parsedData5 = parsearDatos(data5);

          // Filtrar por el distrito seleccionado
          const anioSeleccionado5 = document.getElementById("Anio5").value;
          const datosFiltrados5 = filtrarPorAnio(parsedData5, anioSeleccionado5);

          // Procesar datos
          const { categories5, values5 } = procesarDatos5(datosFiltrados5);

          // Cambiar colores
          const colors5 = assignColors5(categories5);

          // Actualizar las series y categorías con animación
          window.chart5.updateOptions({
            ...window.chart5.w.config, // Copia las opciones actuales
            series: [...values5],
            labels: [...categories5],
            colors: [...colors5]
          });
      })
      .catch(error => {
          document.getElementById("grafico5").textContent = `Error: ${error.message}`;
      });
}

// 5. Función para configurar y renderizar el gráfico
function crearGrafico5(categories, values) {
  // Asignar colores según las categorías
  const colors = assignColors5(categories);

  return new ApexCharts(document.querySelector("#grafico5"), {
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