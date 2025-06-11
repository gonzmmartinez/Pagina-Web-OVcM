// Datos
const archivo1 = "../datos/json/educacion_matriculas.json";

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
        categories_M_1.push(item.Matricula);
        values_M_1.push(item.Frecuencia);
    });

    // Procesar los datos de cada entrada para varones
    data_V.forEach(item => {
        categories_V_1.push(item.Matricula);
        values_V_1.push(item.Frecuencia);
    });

    return { categories_M_1, values_M_1, categories_V_1, values_V_1 };
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
}
function filtrarPorDepartamento(data, departamento) {
    return data.filter(item => item.Departamento === departamento);
}


// INICIALIZACIÓN
function iniciar1() {
    cargarDatos(archivo1) // Cargar los datos del JSON
          .then(data1 => {
              // Parsear los datos
              const parsedData1 = parsearDatos(data1);
  
              // Filtrar por el distrito seleccionado
              const anioSeleccionado1 = "2023";
              const datosFiltrados1_1 = filtrarPorAnio(parsedData1, anioSeleccionado1);

              // Filtrar por el departamento seleccionado
              const deptoSeleccionado1 = "TODOS";
              const datosFiltrados1_2 = filtrarPorDepartamento(datosFiltrados1_1, deptoSeleccionado1);
  
              // Procesar los datos filtrados
              const { categories_M_1, values_M_1, categories_V_1, values_V_1 } = procesarDatos1(datosFiltrados1_2);
  
              // Crear y renderizar el gráfico
              window.chart1 = crearGrafico1(categories_M_1, values_M_1, categories_V_1, values_V_1);
              window.chart1.render();
          })
          .catch(error1 => {
              document.getElementById("grafico1").textContent = `Error: ${error1.message}`;
          });
  }

  function actualizarGrafico1() {
    cargarDatos(archivo1)
        .then(data1 => {
            const parsedData1 = parsearDatos(data1);
  
            // Filtrar por el distrito seleccionado
            const anioSeleccionado1 = document.getElementById("Anio1").value;
            const datosFiltrados1_1 = filtrarPorAnio(parsedData1, anioSeleccionado1);

            // Filtrar por el departamento seleccionado
            const deptoSeleccionado1 = document.getElementById("Depto1").value;
            const datosFiltrados1_2 = filtrarPorDepartamento(datosFiltrados1_1, deptoSeleccionado1);
  
            // Procesar datos
            const { categories_M_1, values_M_1, categories_V_1, values_V_1 } = procesarDatos1(datosFiltrados1_2);
  
            // Actualizar las series y categorías con animación
            window.chart1.updateOptions({
              ...window.chart1.w.config, // Copia las opciones actuales
              series: [{data: [...values_M_1]}, {data: [...values_V_1]}]});
        })
        .catch(error => {
            document.getElementById("grafico1").textContent = `Error: ${error.message}`;
        });
  }

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
                text: "Matricula"
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