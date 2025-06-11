// Datos
const archivo2 = "../../datos/json/denuncias_sud_evolucion.json";

// PROCESAMIENTO
function procesarDatos2(data2) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories2 = [];
    const values2 = [];

    // Procesar los datos de cada entrada
    data2.forEach(item => {
        categories2.push(item.Mes);  // Añadir year_trimestre al eje X
        values2.push(item.Cantidad);            // Añadir Cantidad al eje Y
    });
    return { categories2, values2 };
};

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
};

// CONFIGURACIÓN
function crearGrafico2(categories, values) {
    return new ApexCharts(document.querySelector("#grafico2"), {
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
        colors: ["#e3474b", "#6e3169"],
        title: {},
        xaxis: {
          title: {
            text: 'Mes'
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
            fontSize: '1rem',
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
};

// INICIALIZACIÓN
function iniciar2() {
  cargarDatos(archivo2) // Cargar los datos del JSON
        .then(data2 => {
            // Parsear los datos
            const datosParseados2 = parsearDatos(data2);

            // Filtrar datos
            const anioSeleccionado2 = "2024";
            const datosFiltrados2 = filtrarPorAnio(datosParseados2, anioSeleccionado2);

            // Procesar los datos filtrados
            const { categories2, values2 } = procesarDatos2(datosFiltrados2);

            // Crear y renderizar el gráfico
            window.chart2 = crearGrafico2(categories2, values2 );
            window.chart2.render();
        })
        .catch(error2 => {
            document.getElementById("grafico2").textContent = `Error: ${error1.message}`;
        });
};

function actualizarGrafico2() {
  cargarDatos(archivo2)
      .then(data2 => {
          const datosParseados2 = parsearDatos(data2);

          // Filtrar por el distrito seleccionado
          const anioSeleccionado2 = document.getElementById("Anio2").value;
          const datosFiltrados2 = filtrarPorAnio(datosParseados2, anioSeleccionado2);

          // Procesar datos
          const { categories2, values2 } = procesarDatos2(datosFiltrados2);

          // Actualizar las series y categorías con animación
          window.chart2.updateOptions({
            ...window.chart2.w.config, // Copia las opciones actuales
            series: [{ data: [...values2] }, { data: [...values2] }],
            xaxis: { categories: [...categories2] } }, true); // Animación en opciones
      })
      .catch(error => {
          document.getElementById("grafico2").textContent = `Error: ${error.message}`;
      });
};