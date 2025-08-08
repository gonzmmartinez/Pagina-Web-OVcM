// Datos
const archivo4 = "../datos/json/trabajo_actividad.json";

// 4. Función para procesar los datos y agruparlos por Año-Trimestre
function procesarDatos4(data4) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories_M_4 = [];
    const values_M_4 = [];
    const categories_V_4 = [];
    const values_V_4 = [];

    // Filtrar los datos por género
    const data_M = data4.filter(item => item.Género === "Mujeres");
    const data_V = data4.filter(item => item.Género === "Varones");

    // Procesar los datos para mujeres
    data_M.forEach(item => {
        categories_M_4.push(item.Trimestre);  // Añadir year_trimestre al eje X
        values_M_4.push(item.Tasa_Actividad);      // Añadir Tasa_actividad al eje Y
    });

    // Procesar los datos para varones
    data_V.forEach(item => {
        categories_V_4.push(item.Trimestre);  // Añadir year_trimestre al eje X
        values_V_4.push(item.Tasa_Actividad);      // Añadir Tasa_actividad al eje Y
    });

    return { categories_M_4, values_M_4, categories_V_4, values_V_4 };
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
};

// INICIALIZACIÓN
function iniciar4() {
    return cargarDatos(archivo4)
        .then(data4 => {
            const parsedData4 = parsearDatos(data4);

            const { categories_M_4, values_M_4, categories_V_4, values_V_4 } = procesarDatos4(parsedData4);

            if (window.chart4) {
                try { window.chart4.destroy(); } catch (e) { }
            }

            const contenedor = document.querySelector("#grafico4");
            if (contenedor) contenedor.innerHTML = "";

            const chart = crearGrafico4(categories_M_4, values_M_4, categories_V_4, values_V_4);
            chart.render();
            window.chart4 = chart;

            return chart;
        })
        .catch(error4 => {
            document.getElementById("grafico4").textContent = `Error: ${error4.message}`;
            return null;
        });
}


function actualizarGrafico4() {
    cargarDatos(archivo4)
        .then(data4 => {
            const parsedData4 = parsearDatos(data4);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado4 = document.getElementById("Anio4").value;
            const datosFiltrados4 = filtrarPorAnio(parsedData4, anioSeleccionado4);

            // Procesar datos
            const { categories_M_4, values_M_4, categories_V_4, values_V_4 } = procesarDatos4(datosFiltrados4);

            // Actualizar las series y categorías con animación
            window.chart4.updateOptions({
                ...window.chart4.w.config, // Copia las opciones actuales
                series: [{ data: [...values_M_4] }, { data: [...values_V_4] }],
                xaxis: {
                    categories: [...categories_M_4]
                }
            });
        })
        .catch(error => {
            document.getElementById("grafico4").textContent = `Error: ${error.message}`;
        });
};

function actualizarSubtitulo4() {
    const anioSeleccionado = document.getElementById("Anio4").value;
    const subtitulo = document.getElementById("subtitulo4");
    subtitulo.innerHTML = `<i>Por género. Por trimestre. Provincia de Salta. Año ${anioSeleccionado}.</i>`;
}

// 5. Función para configurar y renderizar el gráfico
function crearGrafico4(categories_M, values_M, categories_V, values_V) {
    return new ApexCharts(document.querySelector("#grafico4"), {
        chart: {
            type: 'line',
            height: '350px',
            toolbar: {
                show: false,
                autoSelected: 'pan'
            }
        },
        series: [{
            name: 'Tasa Mujeres',
            type: 'line',
            data: values_M
        }, {
            name: 'Tasa Varones',
            type: 'line',
            data: values_V
        }],
        title: {},
        colors: ["#45488d", "#e3753d"],
        yaxis: {
            title: {
                text: "Tasa de actividad"
            },
            min: 20,
            max: 80
        },
        xaxis: {
            title: {
                text: "Trimestre"
            },
            categories: categories_M
        },
        tooltip: {
            enabled: true,
            followCursor: true,
        }
    });
};