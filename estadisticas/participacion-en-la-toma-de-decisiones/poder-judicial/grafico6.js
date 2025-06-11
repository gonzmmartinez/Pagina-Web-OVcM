// Datos
const archivo6 = "../../datos/json/poder_judicial_personal_servicio.json";

// PROCESAMIENTO
function procesarDatos6(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories_M_6 = [];
    const values_M_6 = [];
    const categories_V_6 = [];
    const values_V_6 = [];
    
    const data_M = data.filter(item => item.Género === "Mujeres");
    const data_V = data.filter(item => item.Género === "Varones");

    // Procesar los datos de cada entrada para mujeres
    data_M.forEach(item => {
        categories_M_6.push(item.Año);
        values_M_6.push(item.Cantidad);
    });

    // Procesar los datos de cada entrada para varones
    data_V.forEach(item => {
        categories_V_6.push(item.Año);
        values_V_6.push(item.Cantidad);
    });

    return { categories_M_6, values_M_6, categories_V_6, values_V_6 };
}


// INICIALIZACIÓN
function iniciar6() {
    cargarDatos(archivo6) // Cargar los datos del JSON
          .then(data6 => {
              // Parsear los datos
              const parsedData6 = parsearDatos(data6);
  
              // Procesar los datos filtrados
              const { categories_M_6, values_M_6, categories_V_6, values_V_6 } = procesarDatos6(parsedData6);
  
              // Crear y renderizar el gráfico
              window.chart6 = crearGrafico6(categories_M_6, values_M_6, categories_V_6, values_V_6);
              window.chart6.render();
          })
          .catch(error6 => {
              document.getElementById("grafico6").textContent = `Error: ${error6.message}`;
          });
};

// Configurar las opciones
function crearGrafico6(categories_M, values_M, categories_V, values_V) {
    return new ApexCharts(document.querySelector("#grafico6"), {
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