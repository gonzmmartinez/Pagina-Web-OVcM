// Datos
const archivo3 = "../../datos/json/denuncias_ovfg_tipos.json";

// PROCESAMIENTO
function procesarDatos3(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories3 = [];
    const values3 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories3.push(item.Tipo);
        values3.push(item.Porcentaje);            
    });

    return { categories3, values3 };
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
  return data.filter(item => item.Año === year);
}

// COLORES
// Función para asignar colores
function assignColors3(categories3) {
  return categories3.map(category => {
    switch (category) {
      case "Psicológica":
        return "#2b768a"; 
      case "Otros":
        return "#dbdbdb";
      case "Física":
        return "#e3474b"; 
      case "Simbólica":
        return "#1468b1"; 
      case "Económica/Patrimonial":
        return "#a9a226";
      case "Sexual":
        return "#e3753d";
      default:
        return "#CCCCCC"; // Gris por defecto
    }
  });
}

// INICIALIZACIÓN
function iniciar3() {
  cargarDatos(archivo3) // Cargar los datos del JSON
        .then(data3 => {
            // Parsear los datos
            const parsedData3 = parsearDatos(data3);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado3 = "TODOS";
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
}

function actualizarGrafico3() {
  cargarDatos(archivo3)
      .then(data3 => {
          const parsedData3 = parsearDatos(data3);

          // Filtrar por el distrito seleccionado
          const anioSeleccionado3 = document.getElementById("Anio3").value;
          const datosFiltrados3 = filtrarPorAnio(parsedData3, anioSeleccionado3);

          // Procesar datos
          const { categories3, values3 } = procesarDatos3(datosFiltrados3);

          // Cambiar colores
          const colors3 = assignColors3(categories3);

          // Actualizar las series y categorías con animación
          window.chart3.updateOptions({
            ...window.chart3.w.config, // Copia las opciones actuales
            series: [...values3],
            labels: [...categories3],
            colors: [...colors3]
          });
      })
      .catch(error => {
          document.getElementById("grafico3").textContent = `Error: ${error.message}`;
      });
}

// 5. Función para configurar y renderizar el gráfico
function crearGrafico3(categories, values) {
  // Asignar colores según las categorías
  const colors = assignColors3(categories);

  return new ApexCharts(document.querySelector("#grafico3"), {
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