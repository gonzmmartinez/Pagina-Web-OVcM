// Datos
const archivo3 = "../datos/json/femicidios_evolucion.json";

// PROCESAMIENTO
function procesarDatos3(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories3 = [];
    const values3 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories3.push(item.Año);
        values3.push(item.Cantidad);            
    });

    return { categories3, values3 };
}

// INICIALIZACIÓN
function iniciar3() {
  cargarDatos(archivo3) // Cargar los datos del JSON
        .then(data3 => {
            // Parsear los datos
            const parsedData3 = parsearDatos(data3);

            // Procesar los datos filtrados
            const { categories3, values3 } = procesarDatos3(parsedData3);

            // Crear y renderizar el gráfico
            window.chart3 = crearGrafico3(categories3, values3);
            window.chart3.render();
        })
        .catch(error1 => {
            document.getElementById("grafico3").textContent = `Error: ${error1.message}`;
        });
}

function actualizarGrafico3() {
  cargarDatos(archivo3)
      .then(data3 => {
          const parsedData3 = parsearDatos(data3);

          // Procesar datos
          const { categories3, values3 } = procesarDatos3(parsedData3);

          // Actualizar las series y categorías con animación
          window.chart3.updateOptions({
            series: [{data: values3}],
            xaxis: { categories: categories3}
        });
      })
      .catch(error => {
          document.getElementById("grafico3").textContent = `Error: ${error.message}`;
      });
}

// 5. Función para configurar y renderizar el gráfico
function crearGrafico3(categories, values) {
    return new ApexCharts(document.querySelector("#grafico3"), {
        chart: {
            type: 'bar',
            height: '350px',
            toolbar: {
              show: false
            }
        },
        series: [{
            name: 'Cantidad de femicidios',
            type: 'bar',
            data: values
        }],
        title: {},
        colors: ["#2b768a", "#a9a226", "#e3474b", "#e3753d", "#e3a22e", "#1468b1", "#45488d"],
        yaxis: {
            title: {
                text: "Cantidad de femicidios"
            }
        },
        xaxis: {
            title: {
                text: "Año"
            },
            categories: categories
        },
        tooltip: {
            enabled: true,
            followCursor: true,
        },
        dataLabels: {
          enabled: true,
          dropShadow: false,
          style: {
            fontSize: '1rem',
            fontWeight: 'bold',
            color: 'white'
          },
        }
    });
  }