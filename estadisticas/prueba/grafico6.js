// Datos
const archivo6 = "../datos/json/trabajo_subocupacion.json";

// 4. Función para procesar los datos y agruparlos por Año-Trimestre
function procesarDatos6(data6) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories_M_6 = [];
    const values_M_6 = [];
    const categories_V_6 = [];
    const values_V_6 = [];

    // Filtrar los datos por género
    const data_M = data6.filter(item => item.Género === "Mujeres");
    const data_V = data6.filter(item => item.Género === "Varones");

    // Procesar los datos para mujeres
    data_M.forEach(item => {
        categories_M_6.push(item.Trimestre);  // Añadir year_trimestre al eje X
        values_M_6.push(item.Tasa_Subocupacion);      // Añadir Tasa_actividad al eje Y
    });

    // Procesar los datos para varones
    data_V.forEach(item => {
        categories_V_6.push(item.Trimestre);  // Añadir year_trimestre al eje X
        values_V_6.push(item.Tasa_Subocupacion);      // Añadir Tasa_actividad al eje Y
    });

    return { categories_M_6, values_M_6, categories_V_6, values_V_6 };
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
};

// INICIALIZACIÓN
function iniciar6() {
  return cargarDatos(archivo6)
    .then(data6 => {
      const parsedData6 = parsearDatos(data6);

      const { categories_M_6, values_M_6, categories_V_6, values_V_6 } = procesarDatos6(parsedData6);

      if (window.chart6) {
        try { window.chart6.destroy(); } catch (e) {}
      }

      const contenedor = document.querySelector("#grafico6");
      if (contenedor) contenedor.innerHTML = "";

      const chart = crearGrafico6(categories_M_6, values_M_6, categories_V_6, values_V_6);
      chart.render();
      window.chart6 = chart;

      return chart;
    })
    .catch(error6 => {
      document.getElementById("grafico6").textContent = `Error: ${error6.message}`;
      return null;
    });
}

// 6. Función para configurar y renderizar el gráfico
function crearGrafico6(categories_M, values_M, categories_V, values_V) {
    return new ApexCharts(document.querySelector("#grafico6"), {
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
                text: "Tasa de subocupación"
            },
            min: 0,
            max: 30
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