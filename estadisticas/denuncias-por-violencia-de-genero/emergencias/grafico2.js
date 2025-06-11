// Datos
const archivo2 = "../../datos/json/denuncias_911_por_mes.json";

// PROCESAMIENTO
function procesarDatos2(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories2 = [];
    const values2 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories2.push(item.Mes);
        values2.push(item.Cantidad);            
    });

    return { categories2, values2 };
};

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
};

// INICIALIZACIÓN
function iniciar2() {
  cargarDatos(archivo2) // Cargar los datos del JSON
        .then(data2 => {
            // Parsear los datos
            const parsedData2 = parsearDatos(data2);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado2 = "2024";
            const datosFiltrados2 = filtrarPorAnio(parsedData2, anioSeleccionado2);

            // Procesar los datos filtrados
            const { categories2, values2 } = procesarDatos2(datosFiltrados2);

            // Crear y renderizar el gráfico
            window.chart2 = crearGrafico2(categories2, values2);
            window.chart2.render();
        })
        .catch(error1 => {
            document.getElementById("grafico2").textContent = `Error: ${error1.message}`;
        });
};

function actualizarGrafico2() {
  cargarDatos(archivo2)
      .then(data2 => {
        const parsedData2 = parsearDatos(data2);

        // Filtrar por el distrito seleccionado
        const anioSeleccionado2 = document.getElementById("Anio2").value;
        const datosFiltrados2 = filtrarPorAnio(parsedData2, anioSeleccionado2);

        // Procesar datos
        const { categories2, values2 } = procesarDatos2(datosFiltrados2);

        // Actualizar las series y categorías con animación
        window.chart2.updateOptions({
            ...window.chart2.w.config, // Copia las opciones actuales
            series: [{data: [...values2]}],
            xaxis: { categories: [...categories2],
                    labels: {
                        formatter: function(value) {
                            if (value == null) {
                                return ''; // Manejo de valores no válidos
                            }
                            return value.substring(0, 3); // Procesa solo valores válidos
                        }
                    }
            }
        });
      })
      .catch(error => {
          document.getElementById("grafico2").textContent = `Error: ${error.message}`;
      });
};

// 5. Función para configurar y renderizar el gráfico
function crearGrafico2(categories, values) {
    return new ApexCharts(document.querySelector("#grafico2"), {
        chart: {
            type: 'line',
            height: '350px',
            toolbar: {
              show: false
            }
        },
        series: [{
            name: 'Cantidad',
            type: 'line',
            data: values
        }],
        title: {},
        colors: ["#e3a22e", "#a9a226", "#e3474b", "#e3753d", "#e3a22e", "#1468b1", "#45488d"],
        yaxis: {
            title: {
                text: "Cantidad"
            },
            min: 8000
        },
        xaxis: {
            title: {
                text: "Mes"
            },
            categories: categories,
            labels: {
                formatter: function(value) {
                    if (value == null) {
                        return ''; // Manejo de valores no válidos
                    }
                    return value.substring(0, 3); // Procesa solo valores válidos
                }
            }
        },
        tooltip: {
            enabled: true,
            followCursor: true,
        }
    });
};