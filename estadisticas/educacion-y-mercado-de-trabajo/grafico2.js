// Datos
const archivo2 = "../datos/json/educacion_docentes.json";

// PROCESAMIENTO
function procesarDatos2(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories_M_2 = [];
    const values_M_2 = [];
    const categories_V_2 = [];
    const values_V_2 = [];
    
    const data_M = data.filter(item => item.Género === "Mujeres");
    const data_V = data.filter(item => item.Género === "Varones");

    // Procesar los datos de cada entrada para mujeres
    data_M.forEach(item => {
        categories_M_2.push(item.Departamento);
        values_M_2.push(item.Frecuencia);
    });

    // Procesar los datos de cada entrada para varones
    data_V.forEach(item => {
        categories_V_2.push(item.Departamento);
        values_V_2.push(item.Frecuencia);
    });

    return { categories_M_2, values_M_2, categories_V_2, values_V_2 };
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
}

// INICIALIZACIÓN
function iniciar2() {
    cargarDatos(archivo2) // Cargar los datos del JSON
          .then(data2 => {
              // Parsear los datos
              const parsedData2 = parsearDatos(data2);
  
              // Filtrar por el distrito seleccionado
              const anioSeleccionado2 = "2023";
              const datosFiltrados2 = filtrarPorAnio(parsedData2, anioSeleccionado2);
  
              // Procesar los datos filtrados
              const { categories_M_2, values_M_2, categories_V_2, values_V_2 } = procesarDatos2(datosFiltrados2);
  
            console.log(datosFiltrados2)

              // Crear y renderizar el gráfico
              window.chart2 = crearGrafico2(categories_M_2, values_M_2, categories_V_2, values_V_2);
              window.chart2.render();
          })
          .catch(error1 => {
              document.getElementById("grafico2").textContent = `Error: ${error1.message}`;
          });
  }

  function actualizarGrafico2() {
    cargarDatos(archivo2)
        .then(data2 => {
            const parsedData2 = parsearDatos(data2);
  
            // Filtrar por el distrito seleccionado
            const anioSeleccionado2 = document.getElementById("Anio2").value;
            const datosFiltrados2 = filtrarPorAnio(parsedData2, anioSeleccionado2);

            // Procesar datos
            const { categories_M_2, values_M_2, categories_V_2, values_V_2 } = procesarDatos2(datosFiltrados2);
  
            // Actualizar las series y categorías con animación
            window.chart2.updateOptions({
              ...window.chart2.w.config, // Copia las opciones actuales
              series: [{data: [...values_M_2]}, {data: [...values_V_2]}]});
        })
        .catch(error => {
            document.getElementById("grafico2").textContent = `Error: ${error.message}`;
        });
  }

// Configurar las opciones
function crearGrafico2(categories_M, values_M, categories_V, values_V) {
    return new ApexCharts(document.querySelector("#grafico2"), {
        chart: {
            type: 'bar',
            stacked: true,
            stackType: '100%',
            height: 400,
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
                text: "Departamento"
            },
            labels: {
                rotate: -90,
                style: {
                    fontSize: '0.75rem'
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
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                }
            }
        },
        dataLabels: {
          enabled: true,
          offsetX: 5,
          dropShadow: false,
          style: {
            fontSize: '0.75rem',
            fontWeight: 'bold',
            color: 'white'
          },
          formatter: function(value) {
            return Math.abs(Math.round(value * 10) / 10) + '%'
            }
        },
        legend: {
            position: 'top'
        },
        plotOptions : {
            bar: {
              dataLabels: {
                orientation: 'vertical'
              }
            }
          },
    });
}