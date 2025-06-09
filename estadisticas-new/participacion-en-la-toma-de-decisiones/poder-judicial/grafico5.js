// Datos
const archivo5 = "../../datos/json/poder_judicial_personal_administrativo.json";

// PROCESAMIENTO
function procesarDatos5(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories_M_5 = [];
    const values_M_5 = [];
    const categories_V_5 = [];
    const values_V_5 = [];
    
    const data_M = data.filter(item => item.Género === "Mujeres");
    const data_V = data.filter(item => item.Género === "Varones");

    // Procesar los datos de cada entrada para mujeres
    data_M.forEach(item => {
        categories_M_5.push(item.Año);
        values_M_5.push(item.Cantidad);
    });

    // Procesar los datos de cada entrada para varones
    data_V.forEach(item => {
        categories_V_5.push(item.Año);
        values_V_5.push(item.Cantidad);
    });

    return { categories_M_5, values_M_5, categories_V_5, values_V_5 };
}


// INICIALIZACIÓN
function iniciar5() {
    cargarDatos(archivo5) // Cargar los datos del JSON
          .then(data5 => {
              // Parsear los datos
              const parsedData5 = parsearDatos(data5);
  
              // Procesar los datos filtrados
              const { categories_M_5, values_M_5, categories_V_5, values_V_5 } = procesarDatos5(parsedData5);
  
              // Crear y renderizar el gráfico
              window.chart5 = crearGrafico5(categories_M_5, values_M_5, categories_V_5, values_V_5);
              window.chart5.render();
          })
          .catch(error5 => {
              document.getElementById("grafico5").textContent = `Error: ${error5.message}`;
          });
};

// Configurar las opciones
function crearGrafico5(categories_M, values_M, categories_V, values_V) {
    return new ApexCharts(document.querySelector("#grafico5"), {
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