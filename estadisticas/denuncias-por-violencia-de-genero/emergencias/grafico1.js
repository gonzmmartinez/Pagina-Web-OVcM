// Datos
const archivo1 = "../../datos/json/denuncias_911_evolucion.json";

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

  let tituloX;
  let fontSize;
  let xLabelSize;

  switch (granularidad) {

    case "mes":
      tituloX = "Mes-Año";
      fontSize = "0.5rem";
      xLabelSize = "0.5rem";
      break;

    case "trimestre":
      tituloX = "Trimestre-Año";
      fontSize = "0.75rem";
      xLabelSize = "0.625rem";
      break;

    case "semestre":
      tituloX = "Semestre-Año";
      fontSize = "1rem";
      xLabelSize = "0.75rem";
      break;

    case "anio":
      tituloX = "Año";
      fontSize = "1.25rem";
      xLabelSize = "1rem";
      break;
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
  };

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
    title: {},
    xaxis: xaxisConfig,

    yaxis: {
      title: {
        text: 'Cantidad'
      }
    },

    dataLabels: {
      enabledOnSeries: [0],
      offsetX: 5,
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
          orientation: 'vertical'
        }
      }
    },

    tooltip: {
      enabled: true,
      enabledOnSeries: [0],
      followCursor: true,
      y: {
        formatter: function (value) {
          return value.toLocaleString("es-AR");
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

      const { categories1, values1, groups1 } =
        procesarDatos1(datosParseados1, granularidad);

      window.chart1 =
        crearGrafico1(categories1, values1, groups1, granularidad);

      window.chart1.render();

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

      const { categories1, values1, groups1 } =
        procesarDatos1(datosParseados1, granularidad);

      window.chart1.destroy();

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

// Llamar la función principal al cargar la página
window.addEventListener("load", iniciar1);