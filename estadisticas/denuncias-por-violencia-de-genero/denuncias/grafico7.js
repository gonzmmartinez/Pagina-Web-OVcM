// Datos
const archivo7 = "../../datos/json/denuncias_ovfg_edades_denunciante.json";

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
        categories_M_7.push(item.Rango_etario);
        values_M_7.push(item.Porcentaje);
    });

    // Procesar los datos de cada entrada para varones
    data_V.forEach(item => {
        categories_V_7.push(item.Rango_etario);
        values_V_7.push(item.Porcentaje);
    });

    return { categories_M_7, values_M_7, categories_V_7, values_V_7 };
}

// INICIALIZACIÓN
function iniciar7() {
  cargarDatos(archivo7) // Cargar los datos del JSON
        .then(data7 => {
            // Parsear los datos
            const parsedData7 = parsearDatos(data7);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado7 = "TODOS";
            const datosFiltrados7 = filtrarPorAnio(parsedData7, anioSeleccionado7);

            // Procesar los datos filtrados
            const { categories_M_7, values_M_7, categories_V_7, values_V_7 } = procesarDatos7(datosFiltrados7);

            // Crear y renderizar el gráfico
            window.chart7 = crearGrafico7(categories_M_7, values_M_7, categories_V_7, values_V_7);
            window.chart7.render();
        })
        .catch(error1 => {
            document.getElementById("grafico7").textContent = `Error: ${error1.message}`;
        });
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
  return data.filter(item => item.Año === year);
}

function actualizarGrafico7() {
  cargarDatos(archivo7)
      .then(data7 => {
          const parsedData7 = parsearDatos(data7);

          // Filtrar por el distrito seleccionado
          const anioSeleccionado7 = document.getElementById("Anio7").value;
          const datosFiltrados7 = filtrarPorAnio(parsedData7, anioSeleccionado7);

          // Procesar datos
          const { categories_M_7, values_M_7, categories_V_7, values_V_7 } = procesarDatos7(datosFiltrados7);

          // Actualizar las series y categorías con animación
          window.chart7.updateOptions({
            ...window.chart7.w.config, // Copia las opciones actuales
            series: [{data: [...values_M_7]}, {data: [...values_V_7]}]});
      })
      .catch(error => {
          document.getElementById("grafico7").textContent = `Error: ${error.message}`;
      });
}

// Configurar las opciones
function crearGrafico7(categories_M, values_M, categories_V, values_V) {
    return new ApexCharts(document.querySelector("#grafico7"), {
        chart: {
            type: 'bar',
            stacked: true,
            height: 500,
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
        colors: ["#45488d", "#e3753d"],
        yaxis: {
            title: {
                text: "Rango etario"
            },
            labels: {
                formatter: function(value) {
                    return value.toString().slice(3);
                }
            }
        },
        xaxis: {
            title: {
                text: "Porcentaje"
            },
            labels: {
                formatter: function (value) {
                  return Math.abs(Math.round(value * 10) / 10) + '%';
                }
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
                console.log(value)
                return Math.abs(Math.round(value * 10) / 10) + '%';
                }
            },
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        dataLabels: {
          enabled: true,
          offsetY: 7.5,
          formatter: function (value) {
            if (Math.abs(value) >= 2) {
                return Math.abs(Math.round(value * 10) / 10) + '%';
            } else {
              return ''
            }
          },
          dropShadow: false,
          style: {
            fontSize: '0.5rem',
            fontWeight: 'bold',
            color: 'white'
          },
        }
    });
}