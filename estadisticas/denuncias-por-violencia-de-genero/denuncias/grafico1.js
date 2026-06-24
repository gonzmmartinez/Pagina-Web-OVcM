// Datos
const archivo1 = "../../datos/json/denuncias_ovfg_ingresadas.json";

// Función para filtrar los datos por distrito
function filtrarPorDistrito(data, distrito) {
  return data.filter(item => item.Distrito === distrito);
}

// Función para procesar los datos y agruparlos por Año-Trimestre
function procesarDatos1(data1, granularidad = "trimestre") {

  let datosProcesados = [];

  switch (granularidad) {

    case "trimestre":

      datosProcesados = data1.map(item => ({
        categoria: item.year_trimestre,
        cantidad: item.Cantidad,
        año: item.Año
      }));

      break;

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

        agrupados[key].cantidad += item.Cantidad;

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

      if (!acc[item.año]) {
        acc[item.año] = 0;
      }

      acc[item.año]++;

      return acc;

    }, {});

    groups1 = Object.entries(yearCounts).map(([year, count]) => ({
      title: year,
      cols: count
    }));

  }

  return {
    categories1,
    values1,
    groups1
  };
}

// Función para configurar y renderizar el gráfico
function crearGrafico1(categories, values, groups, granularidad) {
  let tituloX;
  let fontSize;

  switch (granularidad) {

    case "trimestre":
      tituloX = "Trimestre-Año";
      fontSize = "0.5rem";
      break;

    case "semestre":
      tituloX = "Semestre-Año";
      fontSize = "0.75rem";
      break;

    case "anio":
      tituloX = "Año";
      fontSize = "1rem";
      break;

    default:
      tituloX = "";
      fontSize = "0.5rem";
  }

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
          return val.split("-")[0];
        }

        return val;
      }
    }
  };

  if (groups.length > 0) {
    xaxisConfig.group = {
      style: {
        fontSize: '12px',
        fontWeight: 700
      },
      groups: groups
    };
  }

  return new ApexCharts(document.querySelector("#grafico1"), {
    chart: {
      type: 'bar', // Tipo de gráfico: barras
      height: 350,
      toolbar: {
        show: false
      }
    },
    series: [{
      name: 'Cantidad',
      type: 'column',
      data: values
    }],
    colors: ["#e3753d"],
    title: {},
    xaxis: xaxisConfig,
    yaxis: {
      title: {
        text: 'Cantidad'
      },
      labels: {
        formatter: function(val) {
          return val.toLocaleString("es-AR");
        }
      }
    },
    dataLabels: {
      offsetX: 5,
      style: {
        fontSize: fontSize,
        fontWeight: 'normal',
      },
      formatter: function (val) {
        return val.toLocaleString("es-AR");
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          orientation: 'vertical'
        }
      }
    },
    tooltip: {
      enabled: true,
      enabledOnSeries: [0],
      followCursor: true,
      x: {
        formatter: function (val) {

          if (!val.includes("-")) {
            return val;
          }

          const [periodo, year] = val.split("-");

          if (periodo.includes("S")) {
            return periodo.replace("S", "° Semestre ") + "20" + year;
          }

          return periodo + "° Trimestre 20" + year;
        }
      }
    },
    legend: {
      show: false
    }
  });
}

// Función para actualizar el gráfico
function actualizarGrafico1() {

  cargarDatos(archivo1)
    .then(data1 => {

      const parsedData = parsearDatos(data1);

      const distritoSeleccionado =
        document.getElementById("Distrito").value;

      const granularidad =
        document.querySelector('input[name="granularidad"]:checked').value;

      document.getElementById("subtitulo_chart1").innerHTML =
        `<i>${cambiarSubtitulo1(granularidad, distritoSeleccionado)}</i>`;

      const datosFiltrados =
        filtrarPorDistrito(parsedData, distritoSeleccionado);

      const { categories1, values1, groups1 } =
        procesarDatos1(datosFiltrados, granularidad);

      // destruir gráfico viejo
      window.chart1.destroy();

      // recrear limpio (sin estado viejo de Apex)
      window.chart1 = crearGrafico1(
        categories1,
        values1,
        groups1,
        granularidad
      );

      window.chart1.render();

    })
    .catch(error => {
      document.getElementById("grafico1").textContent =
        `Error: ${error.message}`;
    });
}

// Función principal que orquesta el proceso
function iniciar1() {

  cargarDatos(archivo1)
    .then(data1 => {

      const parsedData1 = parsearDatos(data1);

      const distritoSeleccionado =
        document.getElementById("Distrito").value;

      const granularidad =
        document.querySelector('input[name="granularidad"]:checked').value;

      document.getElementById("subtitulo_chart1").innerHTML =
        `<i>${cambiarSubtitulo1(granularidad, distritoSeleccionado)}</i>`;

      const datosFiltrados =
        filtrarPorDistrito(parsedData1, distritoSeleccionado);

      const { categories1, values1, groups1 } =
        procesarDatos1(datosFiltrados, granularidad);

      window.chart1 =
        crearGrafico1(categories1, values1, groups1, granularidad);

      window.chart1.render();

    })
    .catch(error => {
      document.getElementById("grafico1").textContent =
        `Error: ${error.message}`;
    });
};

function cambiarSubtitulo1(granularidad, distrito) {

  let texto = "";

  switch (granularidad) {

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

  switch (distrito) {

    case "TODOS":
      texto += " Provincia de Salta. Todos los distritos judiciales.";
      break;

    case "Centro":
      texto += " Provincia de Salta. Distrito Judicial Centro.";
      break;

    case "Norte-Orán":
      texto += " Provincia de Salta. Distrito Judicial Norte - Circunscripción Orán.";
      break;

    case "Norte-Tartagal":
      texto += " Provincia de Salta. Distrito Judicial Norte - Circunscripción Tartagal.";
      break;

    case "Sur-Anta":
      texto += " Provincia de Salta. Distrito Judicial Sur - Circunscripción Joaquín V. González (Anta).";
      break;

    case "Sur-Metán":
      texto += " Provincia de Salta. Distrito Judicial Sur - Circunscripción Metán.";
      break;

    default:
      texto += ` ${distrito}.`;
  }

  return texto;
}

// Llamar la función principal al cargar la página
window.addEventListener("load", iniciar1);