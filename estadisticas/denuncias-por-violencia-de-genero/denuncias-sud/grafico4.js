// Datos
const archivo4 = "../../datos/json/denuncias_sud_tasa_denuncias.json";

// PROCESAMIENTO
function procesarDatos4(data4) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories4 = [];
    const values4 = [];
    const tasa4 = [];

    // Procesar los datos de cada entrada
    data4.forEach(item => {
        categories4.push(item.Departamento);  // Eje x
        values4.push(item.Cantidad); // Eje y
        tasa4.push(item.Tasa_denuncias) // Eje y
    });
    return { categories4, values4, tasa4 };
};

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
};

// CONFIGURACIÓN
function crearGrafico4(categories, values, tasa) {
    return new ApexCharts(document.querySelector("#grafico4"), {
        chart: {
            type: 'bar',
            height: 400,
            toolbar: {
                show: false
            }
        },
        stroke: {
            width: [0, 4],
            curve: 'straight'
        },
        series: [
            {
                name: 'Cantidad',
                type: 'column',
                data: values,
                yAxisIndex: 0
            },
            {
                name: 'Tasa',
                type: 'line',
                data: tasa,
                yAxisIndex: 1
            }
        ],
        markers: {
                  size: 5,               // Tamaño de los puntos
                },
        colors: ["#e3474b", "#6e3169"],
        xaxis: {
            title: {
                text: 'Mes'
            },
            categories: categories,
            labels: {
              style: {
                fontSize: '10px'
              }
            }
        },
        yaxis: [
          {
            title: {
              text: 'Cantidad'
            },
            labels: {
              formatter: function (val) {
                return Math.round(val).toString();
              }
            }
          },
          {
            opposite: true,
            title: {
              text: 'Tasa de denuncias'
            },
            labels: {
              formatter: function (val) {
                return Math.round(val).toString();
              }
            }
          }
        ],
        dataLabels: {
            enabled: false
        },
        tooltip: {
            shared: true,
            intersect: false,
            followCursor: true,
            y: {
                formatter: function (value, { seriesIndex }) {
                    if (seriesIndex === 0) {
                        // Cantidad: sin decimales y con puntos de miles
                        return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    } else if (seriesIndex === 1) {
                        // Tasa: 3 decimales, separados con coma si querés
                        return value.toFixed(3).replace(".", ",");
                    }
                    return value;
                }
            }
        },
        legend: {
            show: false
        }
    });
}

// INICIALIZACIÓN
function iniciar4() {
  cargarDatos(archivo4) // Cargar los datos del JSON
        .then(data4 => {
            // Parsear los datos
            const datosParseados4 = parsearDatos(data4);

            // Filtrar datos
            const anioSeleccionado4 = "2024";
            const datosFiltrados4 = filtrarPorAnio(datosParseados4, anioSeleccionado4);

            // Procesar los datos filtrados
            const { categories4, values4, tasa4 } = procesarDatos4(datosFiltrados4);

            console.log("Series:", [
              { name: 'Cantidad', type: 'column', data: values4 },
              { name: 'Tasa', type: 'line', data: tasa4 }
            ]);

            // Crear y renderizar el gráfico
            window.chart4 = crearGrafico4( categories4, values4, tasa4 );
            window.chart4.render();
        })
        .catch(error => {
            document.getElementById("grafico4").textContent = `Error: ${error.message}`;
        });
};

function actualizarGrafico4() {
  cargarDatos(archivo4)
      .then(data4 => {
          const datosParseados4 = parsearDatos(data4);

          // Filtrar por el distrito seleccionado
          const anioSeleccionado4 = document.getElementById("Anio4").value;
          const datosFiltrados4 = filtrarPorAnio(datosParseados4, anioSeleccionado4);

          // Procesar datos
          const { categories4, values4, tasa4 } = procesarDatos4(datosFiltrados4);

          // Actualizar las series y categorías con animación
          window.chart4.updateOptions({
            ...window.chart4.w.config, // Copia las opciones actuales
            series: [
              { name: 'Cantidad', type: 'column', data: [...values4] },
              { name: 'Tasa', type: 'line', data: [...tasa4] }
            ],
            xaxis: { categories: [...categories4] } }, true); // Animación en opciones
      })
      .catch(error => {
          document.getElementById("grafico4").textContent = `Error: ${error.message}`;
      });
};