// Datos
const archivo1_3 = "../datos/json/femicidios_edades.json";

// PROCESAMIENTO
function procesarDatos1_3(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories1_3 = [];
    const values1_3 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories1_3.push(item.Rango_etario);
        values1_3.push(item.Cantidad);            
    });

    return { categories1_3, values1_3 };
}

// INICIALIZACIÓN
function iniciar1_3() {
  cargarDatos(archivo1_3) // Cargar los datos del JSON
        .then(data1_3 => {
            // Parsear los datos
            const parsedData1_3 = parsearDatos(data1_3);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado1_3 = "2025";
            const datosFiltrados1_3 = filtrarPorAnio(parsedData1_3, anioSeleccionado1_3);

            // Procesar los datos filtrados
            const { categories1_3, values1_3 } = procesarDatos1_3(datosFiltrados1_3);

            // Crear y renderizar el gráfico
            window.chart1_3 = crearGrafico1_3(categories1_3, values1_3);
            window.chart1_3.render();
        })
        .catch(error1 => {
            document.getElementById("grafico1_3").textContent = `Error: ${error1.message}`;
        });
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
  return data.filter(item => item.Año === year);
}

function actualizarGrafico1_3() {
  cargarDatos(archivo1_3)
      .then(data1_3 => {
          const parsedData1_3 = parsearDatos(data1_3);

          // Filtrar por el distrito seleccionado
          const anioSeleccionado1_3 = document.getElementById("Anio1").value;
          const datosFiltrados1_3 = filtrarPorAnio(parsedData1_3, anioSeleccionado1_3);

          // Procesar datos
          const { categories1_3, values1_3 } = procesarDatos1_3(datosFiltrados1_3);

          // Actualizar las series y categorías con animación
            window.chart1_3.updateOptions({
                ...window.chart1_3.w.config, // Copia las opciones actuales
                series: [{ name: 'Cantidad', data: [...values1_3] }], // Nueva referencia para data
                xaxis: { categories: [...categories1_3] } // Nueva referencia para categorías
            });
      })
      .catch(error => {
          document.getElementById("grafico1_3").textContent = `Error: ${error.message}`;
      });
}

// 5. Función para configurar y renderizar el gráfico
function crearGrafico1_3(categories, values) {
    return new ApexCharts(document.querySelector("#grafico1_3"), {
        chart: {
            type: 'bar',
            height: '80%',
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
        colors: ["#2b768a", "#e3474b", "#e3753d", "#e3a22e", "#2b768a", "#1468b1", "#45488d"],
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
        dataLabels: {
          enabled: true,
          dropShadow: false,
          style: {
            fontSize: '1rem',
            fontWeight: 'bold',
            color: 'white'
          },
        }
    });
  }