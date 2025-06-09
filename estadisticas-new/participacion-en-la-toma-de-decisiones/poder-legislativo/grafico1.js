// Datos
const archivo1 = "../../datos/json/poder_legislativo_diputados.json";

// PROCESAMIENTO
function procesarDatos1(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories_M_1 = [];
    const values_M_1 = [];
    const categories_V_1 = [];
    const values_V_1 = [];
    
    const data_M = data.filter(item => item.Género === "Mujeres");
    const data_V = data.filter(item => item.Género === "Varones");

    // Procesar los datos de cada entrada para mujeres
    data_M.forEach(item => {
        categories_M_1.push(item.Año);
        values_M_1.push(item.Cantidad);
    });

    // Procesar los datos de cada entrada para varones
    data_V.forEach(item => {
        categories_V_1.push(item.Año);
        values_V_1.push(item.Cantidad);
    });

    return { categories_M_1, values_M_1, categories_V_1, values_V_1 };
}


// INICIALIZACIÓN
function iniciar1() {
    cargarDatos(archivo1) // Cargar los datos del JSON
          .then(data1 => {
              // Parsear los datos
              const parsedData1 = parsearDatos(data1);
  
              // Procesar los datos filtrados
              const { categories_M_1, values_M_1, categories_V_1, values_V_1 } = procesarDatos1(parsedData1);
  
              // Crear y renderizar el gráfico
              window.chart1 = crearGrafico1(categories_M_1, values_M_1, categories_V_1, values_V_1);
              window.chart1.render();
          })
          .catch(error1 => {
              document.getElementById("grafico1").textContent = `Error: ${error1.message}`;
          });
};

// Configurar las opciones
function crearGrafico1(categories_M, values_M, categories_V, values_V) {
    return new ApexCharts(document.querySelector("#grafico1"), {
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
            fontSize: '1rem',
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

// LLAMAR FUNCIÓN AL INICIALIZAR
window.addEventListener("load", iniciar1);