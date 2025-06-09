// Datos
const archivo2 = "../../datos/json/salud_partos_tipo.json";

// PROCESAMIENTO
function procesarDatos2(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories2 = [];
    const values2 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories2.push(item.Tipo);
        values2.push(item.Cantidad);            
    });

    return { categories2, values2 };
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
  return data.filter(item => item.Año === year);
}

// COLORES
// Función para asignar colores
function assignColors2(categories2) {
  return categories2.map(category => {
    switch (category) {
      case "Cesárea":
        return "#2b768a";
      case "Parto espontáneo de vértice":
        return "#e3474b"; 
      case "Parto con fórceps":
        return "#1468b1"; 
      case "Extracción con presentación de nalgas":
        return "#a9a226";
      default:
        return "#CCCCCC"; // Gris por defecto
    }
  });
}

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
}

function actualizarGrafico2() {
  cargarDatos(archivo2)
      .then(data2 => {
          const parsedData2 = parsearDatos(data2);

          // Filtrar por el distrito seleccionado
          const anioSeleccionado2 = document.getElementById("Anio2").value;
          const datosFiltrados2 = filtrarPorAnio(parsedData2, anioSeleccionado2);

          // Procesar datos
          const { categories2, values2 } = procesarDatos2(datosFiltrados2);

          // Cambiar colores
          const colors2 = assignColors2(categories2);

          // Actualizar las series y categorías con animación
          window.chart2.updateOptions({
            ...window.chart2.w.config, // Copia las opciones actuales
            series: [...values2],
            labels: [...categories2],
            colors: [...colors2]
          });
      })
      .catch(error => {
          document.getElementById("grafico2").textContent = `Error: ${error.message}`;
      });
}

// 5. Función para configurar y renderizar el gráfico
function crearGrafico2(categories, values) {
  // Asignar colores según las categorías
  const colors = assignColors2(categories);

  return new ApexCharts(document.querySelector("#grafico2"), {
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
        followCursor: true
      },
      legend: {
        show: true,
        fontSize: '7.5rem',
        formatter: function(seriesName, opts) {
          return [seriesName + " - " + opts.w.globals.series[opts.seriesIndex]]
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