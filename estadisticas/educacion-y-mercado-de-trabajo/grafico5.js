// Datos
const archivo5 = "../datos/json/trabajo_empleo.json";

// 4. Función para procesar los datos y agruparlos por Año-Trimestre
function procesarDatos5(data5) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories_M_5 = [];
    const values_M_5 = [];
    const categories_V_5 = [];
    const values_V_5 = [];

    // Filtrar los datos por género
    const data_M = data5.filter(item => item.Género === "Mujeres");
    const data_V = data5.filter(item => item.Género === "Varones");

    // Procesar los datos para mujeres
    data_M.forEach(item => {
        categories_M_5.push(item.Trimestre);  // Añadir year_trimestre al eje X
        values_M_5.push(item.Tasa_Empleo);      // Añadir Tasa_actividad al eje Y
    });

    // Procesar los datos para varones
    data_V.forEach(item => {
        categories_V_5.push(item.Trimestre);  // Añadir year_trimestre al eje X
        values_V_5.push(item.Tasa_Empleo);      // Añadir Tasa_actividad al eje Y
    });

    return { categories_M_5, values_M_5, categories_V_5, values_V_5 };
}

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
            const anioSeleccionado5 = "2024";
            const datosFiltrados5 = filtrarPorAnio(parsedData5, anioSeleccionado5);

            actualizarSubtitulo5();

            // Procesar los datos filtrados
            const { categories_M_5, values_M_5, categories_V_5, values_V_5 } = procesarDatos5(datosFiltrados5);

            // Crear y renderizar el gráfico
            window.chart5 = crearGrafico5(categories_M_5, values_M_5, categories_V_5, values_V_5);
            window.chart5.render();
        })
        .catch(error5 => {
            document.getElementById("grafico5").textContent = `Error: ${error5.message}`;
        });
};

function actualizarGrafico5() {
    cargarDatos(archivo5)
        .then(data5 => {
            const parsedData5 = parsearDatos(data5);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado5 = document.getElementById("Anio5").value;
            const datosFiltrados5 = filtrarPorAnio(parsedData5, anioSeleccionado5);

            actualizarSubtitulo5(); // Actualizá también el subtítulo

            // Procesar datos
            const { categories_M_5, values_M_5, categories_V_5, values_V_5 } = procesarDatos5(datosFiltrados5);

            // Actualizar las series y categorías con animación
            window.chart5.updateOptions({
                ...window.chart5.w.config, // Copia las opciones actuales
                series: [{ data: [...values_M_5] }, { data: [...values_V_5] }],
                xaxis: {
                    categories: [...categories_M_5]
                }
            });
        })
        .catch(error => {
            document.getElementById("grafico5").textContent = `Error: ${error.message}`;
        });
};

function actualizarSubtitulo5() {
    const anioSeleccionado = document.getElementById("Anio5").value;
    const subtitulo = document.getElementById("subtitulo5");
    subtitulo.innerHTML = `<i>Por género. Por trimestre. Provincia de Salta. Año ${anioSeleccionado}.</i>`;
}

// 5. Función para configurar y renderizar el gráfico
function crearGrafico5(categories_M, values_M, categories_V, values_V) {
    return new ApexCharts(document.querySelector("#grafico5"), {
        chart: {
            type: 'line',
            height: '350px',
            toolbar: {
                show: false
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
                text: "Tasa de empleo"
            },
            min: 20,
            max: 80
        },
        xaxis: {
            title: {
                text: "Trimestre"
            },
            categories: categories_M,
            labels: {
                formatter: function (value) {
                    if (value == null) {
                        return ''; // Manejo de valores no válidos
                    }
                    return value + "° T."
                }
            }
        },
        tooltip: {
            enabled: true,
            followCursor: true,
        }
    });
};