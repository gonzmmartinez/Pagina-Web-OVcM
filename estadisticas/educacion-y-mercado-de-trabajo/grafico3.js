// Datos
const archivo3 = "../datos/json/trabajo_actividad.json";

// 4. Función para procesar los datos y agruparlos por Año-Trimestre
function procesarDatos3(data3) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories_M_3 = [];
    const values_M_3 = [];
    const categories_V_3 = [];
    const values_V_3 = [];

    // Filtrar los datos por género
    const data_M = data3.filter(item => item.Género === "Mujeres");
    const data_V = data3.filter(item => item.Género === "Varones");

    // Procesar los datos para mujeres
    data_M.forEach(item => {
        categories_M_3.push(item.year_trimestre);  // Añadir year_trimestre al eje X
        values_M_3.push(item.Tasa_Actividad);      // Añadir Tasa_actividad al eje Y
    });

    // Procesar los datos para varones
    data_V.forEach(item => {
        categories_V_3.push(item.year_trimestre);  // Añadir year_trimestre al eje X
        values_V_3.push(item.Tasa_Actividad);      // Añadir Tasa_actividad al eje Y
    });

    return { categories_M_3, values_M_3, categories_V_3, values_V_3};
}

// 6. Función principal que orquesta el proceso
function iniciar3() {
  cargarDatos(archivo3) // Cargar los datos del JSON
        .then(data3 => {
            // Parsear los datos
            const parsedData3 = parsearDatos(data3);

            // Procesar los datos filtrados
            const { categories_M_3, values_M_3, categories_V_3, values_V_3} = procesarDatos3(parsedData3);

            // Crear y renderizar el gráfico
            window.chart3 = crearGrafico3(categories_M_3, values_M_3, categories_V_3, values_V_3);
            window.chart3.render();
        })
        .catch(error3 => {
            document.getElementById("grafico3").textContent = `Error: ${error1.message}`;
        });
}

// 5. Función para configurar y renderizar el gráfico
function crearGrafico3(categories_M, values_M, categories_V, values_V) {
    return new ApexCharts(document.querySelector("#grafico3"), {
        chart: {
            type: 'line', // Tipo de gráfico: línea
            height: 350,
            zoom: {
                enabled:false
            },
            toolbar: {
              show: false
            }
        },
        stroke: {
          width: [4, 4],
          curve: 'straight'
        },
        series: [{
            name: 'Tasa masculina',
            data: values_V
          },{
            name: 'Tasa femenina',
            data: values_M
        }],
        colors: ["#6e3169", "#e3753d"],
        title: {},
        xaxis: {
            title: {
              text: 'Trimestre-Año'
            },
            categories: categories_M, // Valores para el eje X
        },
        yaxis: {
            title: {
                text: 'Tasa de actividad'
            },
            labels: {
                formatter: function(value) {
                    return value + "%"
                }
            }
        },
        dataLabels: {
            enabled: false,
            offsetX: 5,
            style: {
                fontSize: '0.5rem',
                fontWeight: 'normal',
            }
        },
        tooltip: {
          enabled: true,
          followCursor: true
        },
        legend: {
          show: false
        }
    });
}

function actualizarGrafico3() {
  cargarDatos(archivo3)
      .then(data3 => {
          const parsedData3 = parsearDatos(data3);

          // Procesar datos
          const { categories3, values3, groups3 } = procesarDatos3(parsedData3);

          // Actualizar las series y categorías con animación
          window.chart3.updateOptions({
            ...window.chart3.w.config, // Copia las opciones actuales
            series: [{ data: [...values3] }, { data: [...values3] }],
            xaxis: { categories: [...categories3], group: {groups: [...groups3]} }
          }, true); // Animación en opciones
      })
      .catch(error => {
          document.getElementById("grafico3").textContent = `Error: ${error.message}`;
      });
}