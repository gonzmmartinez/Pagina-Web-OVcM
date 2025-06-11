// Datos
const archivo2 = "../../datos/json/denuncias_ovfg_modalidades.json";

// PROCESAMIENTO
function procesarDatos2(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories2 = [];
    const values2 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories2.push(item.Modalidad);
        values2.push(item.Porcentaje);            
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
      case "Doméstica":
        return "#e3474b"; // Rojo anaranjado
      case "Otras":
        return "#dbdbdb"; // Verde claro
      case "Laboral":
        return "#e3a22e"; // Azul
      case "Acoso callejero":
        return "#1468b1"; // Rosa fuerte
      case "Institucional":
        return "#2b768a"; // Amarillo
      case "Mediática":
        return "#45488d"; // Turquesa
      case "Política":
        return "#e3753d"; // Borgoña
      case "Obstétrica":
        return "#a9a226"; // Púrpura
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
          const anioSeleccionado2 = "TODOS";
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
            colors: [...colors2]});
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
        style: {
          fontSize: '0.8rem',
          fontWeight: 'bold',
          color: 'white'
        },
        formatter: function (val) {
          if (val >= 5) {
            return Math.round(val * 10) / 10 + "%"
          } else {
            return ''
          }
        },
        dropShadow: false,
      }
  });
}