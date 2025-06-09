// Datos
const archivo8 = "../../datos/json/denuncias_ovfg_edades_denunciado.json";

// PROCESAMIENTO
function procesarDatos8(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories_M_8 = [];
    const values_M_8 = [];
    const categories_V_8 = [];
    const values_V_8 = [];
    
    const data_M = data.filter(item => item.Género === "Mujeres");
    const data_V = data.filter(item => item.Género === "Varones");

    // Procesar los datos de cada entrada para mujeres
    data_M.forEach(item => {
        categories_M_8.push(item.Rango_etario);
        values_M_8.push(item.Porcentaje);
    });

    // Procesar los datos de cada entrada para varones
    data_V.forEach(item => {
        categories_V_8.push(item.Rango_etario);
        values_V_8.push(item.Porcentaje);
    });

    return { categories_M_8, values_M_8, categories_V_8, values_V_8 };
}

// INICIALIZACIÓN
function iniciar8() {
  cargarDatos(archivo8) // Cargar los datos del JSON
        .then(data8 => {
            // Parsear los datos
            const parsedData8 = parsearDatos(data8);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado8 = "TODOS";
            const datosFiltrados8 = filtrarPorAnio(parsedData8, anioSeleccionado8);

            // Procesar los datos filtrados
            const { categories_M_8, values_M_8, categories_V_8, values_V_8 } = procesarDatos8(datosFiltrados8);

            console.log(datosFiltrados8);

            // Crear y renderizar el gráfico
            window.chart8 = crearGrafico8(categories_M_8, values_M_8, categories_V_8, values_V_8);
            window.chart8.render();
        })
        .catch(error1 => {
            document.getElementById("grafico8").textContent = `Error: ${error1.message}`;
        });
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
  return data.filter(item => item.Año === year);
}

function actualizarGrafico8() {
  cargarDatos(archivo8)
      .then(data8 => {
          const parsedData8 = parsearDatos(data8);

          // Filtrar por el distrito seleccionado
          const anioSeleccionado8 = document.getElementById("Anio8").value;
          const datosFiltrados8 = filtrarPorAnio(parsedData8, anioSeleccionado8);

          // Procesar datos
          const { categories_M_8, values_M_8, categories_V_8, values_V_8 } = procesarDatos8(datosFiltrados8);

          // Actualizar las series y categorías con animación
          window.chart8.updateOptions({
            ...window.chart8.w.config, // Copia las opciones actuales
            series: [{data: [...values_M_8]}, {data:[...values_V_8]}]
        });
      })
      .catch(error => {
          document.getElementById("grafico8").textContent = `Error: ${error.message}`;
      });
}

// 5. Función para configurar y renderizar el gráfico
function crearGrafico8(categories_M, values_M, categories_V, values_V) {
    return new ApexCharts(document.querySelector("#grafico8"), {
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
        colors: ["#45488d", "#e3753d", "#a9a226", "#e3474b", "#e3753d", "#e3a22e", "#2b768a", "#1468b1", "#45488d"],
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