// Datos
const archivo4 = "../../datos/json/denuncias_ovfg_vinculo.json";

// PROCESAMIENTO
function procesarDatos4(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories4 = [];
    const values4 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        categories4.push(item.Vínculo);
        values4.push(item.Porcentaje);            
    });

    return { categories4, values4 };
};

// INICIALIZACIÓN
function iniciar4() {
  cargarDatos(archivo4) // Cargar los datos del JSON
        .then(data4 => {
            // Parsear los datos
            const parsedData4 = parsearDatos(data4);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado4 = "TODOS";
            const datosFiltrados4 = filtrarPorAnio(parsedData4, anioSeleccionado4);

            // Procesar los datos filtrados
            const { categories4, values4 } = procesarDatos4(datosFiltrados4);

            // Crear y renderizar el gráfico
            window.chart4 = crearGrafico4(categories4, values4);
            window.chart4.render();
        })
        .catch(error1 => {
            document.getElementById("grafico4").textContent = `Error: ${error1.message}`;
        });
};

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
  return data.filter(item => item.Año === year);
};

function actualizarGrafico4() {
  cargarDatos(archivo4)
      .then(data4 => {
          const parsedData4 = parsearDatos(data4);

          // Filtrar por el distrito seleccionado
          const anioSeleccionado4 = document.getElementById("Anio4").value;
          const datosFiltrados4 = filtrarPorAnio(parsedData4, anioSeleccionado4);

          // Procesar datos
          const { categories4, values4 } = procesarDatos4(datosFiltrados4);

          // Actualizar las series y categorías con animación
          window.chart4.updateOptions({
            ...window.chart4.w.config, // Copia las opciones actuales
            series: [{data: [...values4]}],
            xaxis: { categories: [...categories4]}
          });
      })
      .catch(error => {
          document.getElementById("grafico4").textContent = `Error: ${error.message}`;
      });
};

// 5. Función para configurar y renderizar el gráfico
function crearGrafico4(categories, values) {
    return new ApexCharts(document.querySelector("#grafico4"), {
        chart: {
            type: 'bar',
            height: 600,
            toolbar: {
              show: false
            }
        },
        series: [{
            name: 'Porcentaje',
            type: 'bar',
            data: values
        }],
        title: {},
        colors: ["#e3474b"],
        yaxis: {
            title: {
                text: "Vínculo con la persona que ejerció la agresión"
            }
        },
        xaxis: {
            title: {
                text: "Cantidad"
            },
            categories: categories
        },
        tooltip: {
            enabled: true,
            followCursor: true,
            y: {
            formatter: function(val) {
                return Math.round(val * 10) / 10 + '%';
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
          formatter: function (val) {
            if (val >= 5) {
              return Math.round(val * 10) / 10 + "%"
            } else {
              return ''
            }
          },
          dropShadow: false,
          style: {
            fontSize: '0.8rem',
            fontWeight: 'bold',
            color: 'white'
          },
        }
    });
  }