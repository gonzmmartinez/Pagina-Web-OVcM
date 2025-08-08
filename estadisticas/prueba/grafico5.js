// Datos
const archivo5 = "../datos/json/trabajo_empleo.json";

// 4. Función para procesar los datos y agruparlos por Año-Trimestre
function procesarDatos5(data5) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories_M_5 = [];
    const values_M_5 = [];
    const categories_V_5 = [];
    const values_V_5 = [];

    // Filtrar los datos por género
    const data_M = data5.filter(item => item.Género === "Mujeres");
    const data_V = data5.filter(item => item.Género === "Varones");

    // Procesar los datos para mujeres
    data_M.forEach(item => {
        categories_M_5.push(item.Trimestre);  // Añadir year_trimestre al eje X
        values_M_5.push(item.Tasa_Empleo);      // Añadir Tasa_actividad al eje Y
    });

    // Procesar los datos para varones
    data_V.forEach(item => {
        categories_V_5.push(item.Trimestre);  // Añadir year_trimestre al eje X
        values_V_5.push(item.Tasa_Empleo);      // Añadir Tasa_actividad al eje Y
    });

    return { categories_M_5, values_M_5, categories_V_5, values_V_5 };
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
};

// INICIALIZACIÓN
function iniciar5() {
  return cargarDatos(archivo5)
    .then(data5 => {
      const parsedData5 = parsearDatos(data5);

      const { categories_M_5, values_M_5, categories_V_5, values_V_5 } = procesarDatos5(parsedData5);

      if (window.chart5) {
        try { window.chart5.destroy(); } catch (e) {}
      }

      const contenedor = document.querySelector("#grafico5");
      if (contenedor) contenedor.innerHTML = "";

      const chart = crearGrafico5(categories_M_5, values_M_5, categories_V_5, values_V_5);
      chart.render();
      window.chart5 = chart;

      return chart;
    })
    .catch(error5 => {
      document.getElementById("grafico5").textContent = `Error: ${error5.message}`;
      return null;
    });
}


// 5. Función para configurar y renderizar el gráfico
function crearGrafico5(categories_M, values_M, categories_V, values_V) {
    return new ApexCharts(document.querySelector("#grafico5"), {
        chart: {
            type: 'line',
            height: '350px',
            toolbar: {
                show: false
            }
        },
        series: [{
            name: 'Tasa Mujeres',
            type: 'line',
            data: values_M
        }, {
            name: 'Tasa Varones',
            type: 'line',
            data: values_V
        }],
        title: {},
        colors: ["#45488d", "#e3753d"],
        yaxis: {
            title: {
                text: "Tasa de empleo"
            },
            min: 20,
            max: 80
        },
        xaxis: {
            title: {
                text: "Trimestre"
            },
            categories: categories_M,
            labels: {
                formatter: function (value) {
                    if (value == null) {
                        return ''; // Manejo de valores no válidos
                    }
                    return value + "° T."
                }
            }
        },
        tooltip: {
            enabled: true,
            followCursor: true,
        }
    });
};