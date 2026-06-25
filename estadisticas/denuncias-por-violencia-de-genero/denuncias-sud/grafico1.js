// Datos
const archivo1 = "../../datos/json/denuncias_sud_evolucion.json";

// PROCESAMIENTO
function procesarDatos1(data1, granularidad = "anio") {

  let datosProcesados = [];

  switch (granularidad) {

    case "mes":
      datosProcesados = data1.map(item => ({
        categoria: item.year_mes,
        cantidad: item.Cantidad,
        año: item.Año
      }));
      break;

    case "trimestre": {
      const agrupados = {};

      data1.forEach(item => {
        const key = item.year_trimestre;

        if (!agrupados[key]) {
          agrupados[key] = {
            categoria: item.year_trimestre,
            cantidad: 0,
            año: item.Año
          };
        }

        agrupados[key].cantidad += item.Cantidad;
      });

      datosProcesados = Object.values(agrupados);

      break;
    }

    case "semestre": {
      const agrupados = {};

      data1.forEach(item => {
        const key = item.year_semestre;

        if (!agrupados[key]) {
          agrupados[key] = {
            categoria: item.year_semestre,
            cantidad: 0,
            año: item.Año
          };
        }

        agrupados[key].cantidad += item.Cantidad;
      });

      datosProcesados = Object.values(agrupados);
      break;
    }

    case "anio": {
      const agrupados = {};

      data1.forEach(item => {
        const key = item.Año;

        if (!agrupados[key]) {
          agrupados[key] = {
            categoria: item.Año.toString(),
            cantidad: 0,
            año: item.Año
          };
        }

        agrupados[key].cantidad += Number(item.Cantidad) || 0;
      });

      datosProcesados = Object.values(agrupados);
      break;
    }
  }

  const categories1 = datosProcesados.map(item => item.categoria);
  const values1 = datosProcesados.map(item => item.cantidad);

  let groups1 = [];

  if (granularidad !== "anio") {
    const yearCounts = datosProcesados.reduce((acc, item) => {
      const year = item.año;
      if (!acc[year]) {
        acc[year] = 0;
      }
      acc[year]++;
      return acc;
    }, {});

    groups1 = Object.entries(yearCounts).map(([year, count]) => ({
      title: year,
      cols: count
    }));
  }

  return { categories1, values1, groups1 };
}

// CONFIGURACIÓN
function crearGrafico1(categories, values, groups, granularidad) {

  // =========================
  // TÍTULO (se mantiene igual)
  // =========================

  let tituloX;

  switch (granularidad) {
    case "mes":
      tituloX = "Mes-Año";
      break;
    case "trimestre":
      tituloX = "Trimestre-Año";
      break;
    case "semestre":
      tituloX = "Semestre-Año";
      break;
    case "anio":
      tituloX = "Año";
      break;
    default:
      tituloX = "";
  }

  // =========================
  // DINÁMICA POR CANTIDAD DE BARRAS
  // =========================

  const n = values.length;

  const minBars = 2;
  const maxBars = 40;

  const maxFont = 1.5; // rem
  const minFont = 0.5; // rem

  const clamped = Math.min(Math.max(n, minBars), maxBars);
  const t = (clamped - minBars) / (maxBars - minBars);

  const fontSizeRem = maxFont - t * (maxFont - minFont);

  const fontSize = `${fontSizeRem.toFixed(2)}rem`;
  const xLabelSize = `${(fontSizeRem * 0.75).toFixed(2)}rem`;

  const hideDataLabels = n > 40;

  // mantenemos tu offset fijo (como pediste “misma lógica del otro gráfico”)
  const offsetX = 3;

  // =========================
  // X AXIS
  // =========================

  const xaxisConfig = {
    title: {
      text: tituloX
    },
    categories: categories,
    labels: {
      formatter: function (val) {

        if (!val || typeof val !== "string") {
          return val ?? "";
        }

        if (val.includes("-")) {
          return parseInt(val.split("-")[0], 10);
        }

        return val;
      },
      style: {
        fontSize: xLabelSize
      }
    }
  };

  if (groups.length > 0) {
    xaxisConfig.group = {
      style: {
        fontSize: '0.75rem',
        fontWeight: 500
      },
      groups: groups
    };
  }

  // =========================
  // RETURN CHART
  // =========================

  return new ApexCharts(document.querySelector("#grafico1"), {

    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },

    series: [
      {
        name: 'Cantidad',
        type: 'column',
        data: values
      }
    ],

    colors: ["#e3753d"],

    xaxis: xaxisConfig,

    yaxis: {
      title: {
        text: 'Cantidad'
      },
      labels: {
        formatter: function (value) {
          return value.toLocaleString("es-AR");
        }
      }
    },

    dataLabels: {
      enabled: !hideDataLabels,
      textAnchor: 'middle',
      offsetX: offsetX,
      style: {
        fontSize: fontSize,
        fontWeight: 'normal'
      },
      formatter: function (value) {
        return value.toLocaleString("es-AR");
      }
    },

    plotOptions: {
      bar: {
        dataLabels: {
          position: 'center',
          orientation: 'vertical'
        }
      }
    },

    tooltip: {
      enabled: true,
      followCursor: true,
      x: {
        formatter: function (val) {

          if (!val.includes("-")) {
            return val;
          }

          const [periodo, year] = val.split("-");

          switch (granularidad) {

            case "mes": {
              const meses = [
                "Enero", "Febrero", "Marzo", "Abril",
                "Mayo", "Junio", "Julio", "Agosto",
                "Septiembre", "Octubre", "Noviembre", "Diciembre"
              ];

              return `${meses[parseInt(periodo, 10) - 1]} 20${year}`;
            }

            case "trimestre":
              return `${parseInt(periodo, 10)}° Trimestre 20${year}`;

            case "semestre":
              return `${parseInt(periodo, 10)}° Semestre 20${year}`;

            case "anio":
              return `20${year}`;

            default:
              return val;
          }
        }
      }
    },

    legend: {
      show: false
    }
  });
}

// INICIALIZACIÓN
function iniciar1() {
  cargarDatos(archivo1)
    .then(data1 => {

      const datosParseados1 = parsearDatos(data1);

      const granularidad =
        document.querySelector('input[name="granularidad"]:checked').value;

      document.getElementById("subtitulo_chart1").innerHTML =
        `<i>${cambiarSubtitulo1(granularidad)}</i>`;

      const { categories1, values1, groups1 } =
        procesarDatos1(datosParseados1, granularidad);

      window.chart1 =
        crearGrafico1(categories1, values1, groups1, granularidad);

      window.chart1.render().then(() => {
        document.querySelectorAll('#grafico1 .apexcharts-datalabel')
          .forEach(el => {
            el.setAttribute('dominant-baseline', 'middle');
          });
      });
      
    })
    .catch(error1 => {
      document.getElementById("grafico1").textContent =
        `Error: ${error1.message}`;
    });
}

function actualizarGrafico1() {

  cargarDatos(archivo1)
    .then(data1 => {

      const datosParseados1 = parsearDatos(data1);

      const granularidad =
        document.querySelector('input[name="granularidad"]:checked').value;

      document.getElementById("subtitulo_chart1").innerHTML =
        `<i>${cambiarSubtitulo1(granularidad)}</i>`;

      const { categories1, values1, groups1 } =
        procesarDatos1(datosParseados1, granularidad);

      window.chart1.destroy();

      window.chart1 = crearGrafico1(
        categories1,
        values1,
        groups1,
        granularidad
      );

      window.chart1.render().then(() => {
        document.querySelectorAll('#grafico1 .apexcharts-datalabel')
          .forEach(el => {
            el.setAttribute('dominant-baseline', 'middle');
          });
      });

    })
    .catch(error => {
      document.getElementById("grafico1").textContent =
        `Error: ${error.message}`;
    });
}

// Función para actualizar dinámicamente el subtítulo
function cambiarSubtitulo1(granularidad) {
  let texto = "";

  switch (granularidad) {
    case "mes":
      texto = "Serie mensual de denuncias.";
      break;
    case "trimestre":
      texto = "Serie trimestral de denuncias.";
      break;
    case "semestre":
      texto = "Serie semestral de denuncias.";
      break;
    case "anio":
      texto = "Serie anual de denuncias.";
      break;
    default:
      texto = "";
  }

  return texto += " Provincia de Salta.";
}

// Llamar la función principal al cargar la página
window.addEventListener("load", iniciar1);


document
  .querySelectorAll('.apexcharts-datalabel')
  .forEach(el => {
    el.setAttribute('dominant-baseline', 'middle');
  });