// Datos
const archivo1 = "../../datos/json/denuncias_ovfg_ingresadas.json";

// 3. Función para filtrar los datos por distrito
function filtrarPorDistrito(data, distrito) {
  return data.filter(item => item.Distrito === distrito);
}

// 4. Función para procesar los datos y agruparlos por Año-Trimestre
function procesarDatos1(data1) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories1 = [];
    const values1 = [];

    // Procesar los datos de cada entrada
    data1.forEach(item => {
        categories1.push(item.year_trimestre);  // Añadir year_trimestre al eje X
        values1.push(item.Cantidad);            // Añadir Cantidad al eje Y
    });

    // Contar ocurrencias de cada Año en groupedData1
      const yearCounts = data1.reduce((acc, item) => {
        const year = `20${item.year_trimestre.split('-')[1]}`; // Extraer el año completo
        if (!acc[year]) {
            acc[year] = 0;
        }
        acc[year] += 1; // Contar cuántas veces aparece este año
        return acc;
    }, {});

    // Crear el array de grupos para años y sus columnas (trimestres)
      const groups1 = Object.entries(yearCounts).map(([year, count]) => ({
        title: year,
        cols: count
    }));

    return { categories1, values1, groups1 };
}

// 5. Función para configurar y renderizar el gráfico
function crearGrafico1(categories, values, groups) {
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
            text: 'Trimestre-Año'
          },
          categories: categories, // Valores para el eje X
          labels: {
            formatter: function(val) {
              return val[0]
            }
          },
          group: {
            style: {
              fontSize: '12px',
              fontWeight: 700
            },
            groups: groups
          }
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
            fontSize: '0.5rem',
            fontWeight: 'normal',
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
          x: {
            formatter: function(val) {
              const [trimestre, year] = val.split("-");
              return trimestre + "° Trimestre 20" + year;
            }
          }
        },
        legend: {
          show: false
        }
    });
}

// 6. Función principal que orquesta el proceso
function iniciar1() {
  cargarDatos(archivo1) // Cargar los datos del JSON
        .then(data1 => {
            // Parsear los datos
            const parsedData1 = parsearDatos(data1);

            // Filtrar por el distrito seleccionado
            const distritoSeleccionado1 = "TODOS";
            const datosFiltrados1 = filtrarPorDistrito(parsedData1, distritoSeleccionado1);

            // Procesar los datos filtrados
            const { categories1, values1, groups1 } = procesarDatos1(datosFiltrados1);

            // Crear y renderizar el gráfico
            window.chart1 = crearGrafico1(categories1, values1, groups1);
            window.chart1.render();
        })
        .catch(error1 => {
            document.getElementById("grafico1").textContent = `Error: ${error1.message}`;
        });
}

function actualizarGrafico1() {
  cargarDatos(archivo1)
      .then(data1 => {
          const parsedData = parsearDatos(data1);

          // Filtrar por el distrito seleccionado
          const distritoSeleccionado = document.getElementById("Distrito").value;
          const datosFiltrados = filtrarPorDistrito(parsedData, distritoSeleccionado);

          // Procesar datos
          const { categories1, values1, groups1 } = procesarDatos1(datosFiltrados);

          // Actualizar las series y categorías con animación
          window.chart1.updateOptions({
            ...window.chart1.w.config, // Copia las opciones actuales
            series: [{ data: [...values1] }, { data: [...values1] }],
            xaxis: { categories: [...categories1], group: {groups: [...groups1]} }
          }, true); // Animación en opciones
      })
      .catch(error => {
          document.getElementById("grafico1").textContent = `Error: ${error.message}`;
      });
}

// Llamar la función principal al cargar la página
window.addEventListener("load", iniciar1);