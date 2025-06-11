// Datos
const archivo1_6 = "../datos/json/femicidios_lugar_del_hecho.json";

// PROCESAMIENTO
function procesarDatos1_6(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories1_6 = [];
    const values1_6 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories1_6.push(item.Lugar_del_hecho);
        values1_6.push(item.Cantidad);            
    });

    return { categories1_6, values1_6 };
}

// INICIALIZACIÓN
function iniciar1_6() {
  cargarDatos(archivo1_6) // Cargar los datos del JSON
        .then(data1_6 => {
            // Parsear los datos
            const parsedData1_6 = parsearDatos(data1_6);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado1_6 = "2025";
            const datosFiltrados1_6 = filtrarPorAnio(parsedData1_6, anioSeleccionado1_6);

            // Procesar los datos filtrados
            const { categories1_6, values1_6 } = procesarDatos1_6(datosFiltrados1_6);

            // Crear y renderizar el gráfico
            window.chart1_6 = crearGrafico1_6(categories1_6, values1_6);
            window.chart1_6.render();
        })
        .catch(error1 => {
            document.getElementById("grafico1_6").textContent = `Error: ${error1.message}`;
        });
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
  return data.filter(item => item.Año === year);
}

function actualizarGrafico1_6() {
  cargarDatos(archivo1_6)
      .then(data1_6 => {
          const parsedData1_6 = parsearDatos(data1_6);

          // Filtrar por el distrito seleccionado
          const anioSeleccionado1_6 = document.getElementById("Anio1").value;
          const datosFiltrados1_6 = filtrarPorAnio(parsedData1_6, anioSeleccionado1_6);

          // Procesar datos
          const { categories1_6, values1_6 } = procesarDatos1_6(datosFiltrados1_6);

          // Actualizar las series y categorías con animación
          window.chart1_6.updateOptions({
            ...window.chart1_6.w.config, // Copia las opciones actuales
            series: [{data: [...values1_6]}],
            xaxis: { categories: [...categories1_6]}
        });
      })
      .catch(error => {
          document.getElementById("grafico1_6").textContent = `Error: ${error.message}`;
      });
}

// 5. Función para configurar y renderizar el gráfico
function crearGrafico1_6(categories, values) {
    return new ApexCharts(document.querySelector("#grafico1_6"), {
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
        colors: ["#e3474b", "#e3474b", "#e3753d", "#e3a22e", "#2b768a", "#1468b1", "#45488d"],
        yaxis: {
            title: {
                text: "Cantidad"
            }
        },
        xaxis: {
            title: {
                text: "Lugar del hecho"
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