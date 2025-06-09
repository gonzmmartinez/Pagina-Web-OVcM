// Datos
const archivo5 = "../../datos/json/salud_ile_edad.json";

// PROCESAMIENTO
function procesarDatos5(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories5 = [];
    const values5 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories5.push(item.Rango_etario_pg);
        values5.push(item.Cantidad);            
    });

    return { categories5, values5 };
};

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
};

// INICIALIZACIÓN
function iniciar5() {
  cargarDatos(archivo5) // Cargar los datos del JSON
        .then(data5 => {
            // Parsear los datos
            const parsedData5 = parsearDatos(data5);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado5 = "2023";
            const datosFiltrados5 = filtrarPorAnio(parsedData5, anioSeleccionado5);

            // Procesar los datos filtrados
            const { categories5, values5 } = procesarDatos5(datosFiltrados5);

            // Crear y renderizar el gráfico
            window.chart5 = crearGrafico5(categories5, values5);
            window.chart5.render();
        })
        .catch(error1 => {
            document.getElementById("grafico5").textContent = `Error: ${error1.message}`;
        });
};

function actualizarGrafico5() {
  cargarDatos(archivo5)
      .then(data5 => {
        const parsedData5 = parsearDatos(data5);

        // Filtrar por el distrito seleccionado
        const anioSeleccionado5 = document.getElementById("Anio5").value;
        const datosFiltrados5 = filtrarPorAnio(parsedData5, anioSeleccionado5);

        // Procesar datos
        const { categories5, values5 } = procesarDatos5(datosFiltrados5);

        // Actualizar las series y categorías con animación
        window.chart5.updateOptions({
            ...window.chart5.w.config, // Copia las opciones actuales
            series: [{data: [...values5]}],
            xaxis: { categories: [...categories5]
            }
        });
      })
      .catch(error => {
          document.getElementById("grafico5").textContent = `Error: ${error.message}`;
      });
};

// 5. Función para configurar y renderizar el gráfico
function crearGrafico5(categories, values) {
    return new ApexCharts(document.querySelector("#grafico5"), {
        chart: {
            type: 'bar',
            height: '350px',
            toolbar: {
              show: false
            }
        },
        series: [{
            name: 'Cantidad',
            type: 'bar',
            data: values
        }],
        title: {},
        colors: ["#e3a22e", "#e3a22e", "#a9a226", "#e3474b", "#1468b1", "#45488d"],
        yaxis: {
            title: {
                text: "Cantidad"
            }
        },
        xaxis: {
            title: {
                text: "Rango etario"
            },
            categories: categories
        },
        tooltip: {
            enabled: true,
            followCursor: true,
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    position: 'top'
                }
            }
        },
        dataLabels: {
            enabled: true, 
            formatter: function(value) {
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            },
            offsetY: -20,
            style: {
                colors: ['#000000']
            }
        }
    });
};