// Datos
const archivo1_4 = "../datos/json/femicidios_hijos.json";

// PROCESAMIENTO
function procesarDatos1_4(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories1_4 = [];
    const values1_4 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories1_4.push(item.Hijos);
        values1_4.push(item.Cantidad);            
    });

    return { categories1_4, values1_4 };
}

// INICIALIZACIÓN
function iniciar1_4() {
  cargarDatos(archivo1_4) // Cargar los datos del JSON
        .then(data1_4 => {
            // Parsear los datos
            const parsedData1_4 = parsearDatos(data1_4);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado1_4 = "2025";
            const datosFiltrados1_4 = filtrarPorAnio(parsedData1_4, anioSeleccionado1_4);

            // Procesar los datos filtrados
            const { categories1_4, values1_4 } = procesarDatos1_4(datosFiltrados1_4);

            // Crear y renderizar el gráfico
            window.chart1_4 = crearGrafico1_4(categories1_4, values1_4);
            window.chart1_4.render();
        })
        .catch(error1 => {
            document.getElementById("grafico1_4").textContent = `Error: ${error1.message}`;
        });
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
  return data.filter(item => item.Año === year);
}

function actualizarGrafico1_4() {
  cargarDatos(archivo1_4)
      .then(data1_4 => {
          const parsedData1_4 = parsearDatos(data1_4);

          // Filtrar por el distrito seleccionado
          const anioSeleccionado1_4 = document.getElementById("Anio1").value;
          const datosFiltrados1_4 = filtrarPorAnio(parsedData1_4, anioSeleccionado1_4);

          // Procesar datos
          const { categories1_4, values1_4 } = procesarDatos1_4(datosFiltrados1_4);

          // Actualizar las series y categorías con animación
          window.chart1_4.updateOptions({
            ...window.chart1_4.w.config, // Copia las opciones actuales
            series: [{data: [...values1_4]}],
            xaxis: { categories: [...categories1_4]}
        });
      })
      .catch(error => {
          document.getElementById("grafico1_4").textContent = `Error: ${error.message}`;
      });
}

// 5. Función para configurar y renderizar el gráfico
function crearGrafico1_4(categories, values) {
    return new ApexCharts(document.querySelector("#grafico1_4"), {
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
        colors: ["#e3a22e", "#e3474b", "#e3753d", "#e3a22e", "#2b768a", "#1468b1", "#45488d"],
        yaxis: {
            title: {
                text: "Cantidad"
            }
        },
        xaxis: {
            title: {
                text: "Cantidad de hijas/os"
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