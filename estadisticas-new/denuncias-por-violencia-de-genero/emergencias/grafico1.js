// Datos
const archivo1 = "../../datos/json/denuncias_911_evolucion.json";

// PROCESAMIENTO
function procesarDatos1(data1) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories1 = [];
    const values1 = [];

    // Procesar los datos de cada entrada
    data1.forEach(item => {
        categories1.push(item.Año);  // Añadir year_trimestre al eje X
        values1.push(item.Cantidad);            // Añadir Cantidad al eje Y
    });

    return { categories1, values1 };
}

// CONFIGURACIÓN
function crearGrafico1(categories, values) {
    return new ApexCharts(document.querySelector("#grafico1"), {
        chart: {
            type: 'bar', // Tipo de gráfico: barras
            height: 350,
            toolbar: {
              show: false
            }
        },
        stroke: {
          width: [0, 4],
          curve: 'straight'
        },
        series: [{
            name: 'Cantidad',
            type: 'column',
            data: values
        },{
          name: 'Cantidad',
          type: 'line',
          data: values
        }],
        colors: ["#e3753d", "#6e3169"],
        title: {},
        xaxis: {
          title: {
            text: 'Año'
          },
          categories: categories, // Valores para el eje X
        },
        yaxis: {
            title: {
                text: 'Cantidad'
            }
        },
        dataLabels: {
          enabledOnSeries: [0],
          offsetX: 5,
          style: {
            fontSize: '1.25rem',
            fontWeight: 'normal',
          },
          formatter: function(value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          }
        },
        plotOptions : {
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
            formatter: function(value) {
              return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
  cargarDatos(archivo1) // Cargar los datos del JSON
        .then(data1 => {
            // Parsear los datos
            const datosParseados1 = parsearDatos(data1);

            // Procesar los datos filtrados
            const { categories1, values1 } = procesarDatos1(datosParseados1);

            // Crear y renderizar el gráfico
            window.chart1 = crearGrafico1(categories1, values1 );
            window.chart1.render();
        })
        .catch(error1 => {
            document.getElementById("grafico1").textContent = `Error: ${error1.message}`;
        });
}

function actualizarGrafico1() {
  cargarDatos(archivo1)
      .then(data1 => {
          const datosParseados1 = parsearDatos(data1);

          // Procesar datos
          const { categories1, values1 } = procesarDatos1(datosParseados1);

          // Actualizar las series y categorías con animación
          window.chart1.updateOptions({
            ...window.chart1.w.config, // Copia las opciones actuales
            series: [{ data: [...values1] }, { data: [...values1] }],
            xaxis: { categories: [...categories1] } }, true); // Animación en opciones
      })
      .catch(error => {
          document.getElementById("grafico1").textContent = `Error: ${error.message}`;
      });
}

// 8. Llamar la función principal al cargar la página
window.addEventListener("load", iniciar1);