// Datos
const archivo7 = "../../datos/json/poder_judicial_secretarias.json";

// PROCESAMIENTO
function procesarDatos7(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories_M_7 = [];
    const values_M_7 = [];
    const categories_V_7 = [];
    const values_V_7 = [];
    
    const data_M = data.filter(item => item.Género === "Mujeres");
    const data_V = data.filter(item => item.Género === "Varones");

    // Procesar los datos de cada entrada para mujeres
    data_M.forEach(item => {
        categories_M_7.push(item.Año);
        values_M_7.push(item.Cantidad);
    });

    // Procesar los datos de cada entrada para varones
    data_V.forEach(item => {
        categories_V_7.push(item.Año);
        values_V_7.push(item.Cantidad);
    });

    return { categories_M_7, values_M_7, categories_V_7, values_V_7 };
}


// INICIALIZACIÓN
function iniciar7() {
    cargarDatos(archivo7) // Cargar los datos del JSON
          .then(data7 => {
              // Parsear los datos
              const parsedData7 = parsearDatos(data7);
  
              // Procesar los datos filtrados
              const { categories_M_7, values_M_7, categories_V_7, values_V_7 } = procesarDatos7(parsedData7);
  
              // Crear y renderizar el gráfico
              window.chart7 = crearGrafico7(categories_M_7, values_M_7, categories_V_7, values_V_7);
              window.chart7.render();
          })
          .catch(error7 => {
              document.getElementById("grafico7").textContent = `Error: ${error7.message}`;
          });
};

// Configurar las opciones
function crearGrafico7(categories_M, values_M, categories_V, values_V) {
    return new ApexCharts(document.querySelector("#grafico7"), {
        chart: {
            type: 'bar',
            stacked: true,
            stackType: '100%',
            height: 350,
            toolbar: {
              show: false
            }
        },
        series: [{
            name: 'Mujeres',
            type: 'bar',
            data: values_M
        },{
            name: 'Varones',
            type: 'bar',
            data: values_V
        }],
        title: {},
        colors: ["#e3753d", "#45488d"],
        yaxis: {
            title: {
                text: "Porcentaje"
            },
            labels: {
                formatter: function(value) {
                    return value + "%"
                }
            }
        },
        xaxis: {
            title: {
                text: "Año"
            },
            categories: categories_M
        },
        tooltip: {
            enabled: true,
            shared: true,
            intersect: false,
            followCursor: true,
            y: {
                formatter: function(value) {
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                }
            }
        },
        dataLabels: {
            enabled: true,
            offsetY: 7.5,
            dropShadow: false,
            style: {
            fontSize: '0.5rem',
            fontWeight: 'bold',
            color: 'white'
            },
            formatter: function(value) {
                return Math.abs(Math.round(value * 10) / 10) + '%'
            }
        },
        legend: {
            position: 'top'
        }
    });
}