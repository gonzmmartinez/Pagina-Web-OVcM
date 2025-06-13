// Datos
const archivo6 = "../datos/json/trabajo_subocupacion.json";

// 4. Función para procesar los datos y agruparlos por Año-Trimestre
function procesarDatos6(data6) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories_M_6 = [];
    const values_M_6 = [];
    const categories_V_6 = [];
    const values_V_6 = [];

    // Filtrar los datos por género
    const data_M = data6.filter(item => item.Género === "Mujeres");
    const data_V = data6.filter(item => item.Género === "Varones");

    // Procesar los datos para mujeres
    data_M.forEach(item => {
        categories_M_6.push(item.Trimestre);  // Añadir year_trimestre al eje X
        values_M_6.push(item.Tasa_Subocupacion);      // Añadir Tasa_actividad al eje Y
    });

    // Procesar los datos para varones
    data_V.forEach(item => {
        categories_V_6.push(item.Trimestre);  // Añadir year_trimestre al eje X
        values_V_6.push(item.Tasa_Subocupacion);      // Añadir Tasa_actividad al eje Y
    });

    return { categories_M_6, values_M_6, categories_V_6, values_V_6 };
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
};

// INICIALIZACIÓN
function iniciar6() {
    cargarDatos(archivo6) // Cargar los datos del JSON
        .then(data6 => {
            // Parsear los datos
            const parsedData6 = parsearDatos(data6);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado6 = "2024";
            const datosFiltrados6 = filtrarPorAnio(parsedData6, anioSeleccionado6);

            actualizarSubtitulo6();

            // Procesar los datos filtrados
            const { categories_M_6, values_M_6, categories_V_6, values_V_6 } = procesarDatos6(datosFiltrados6);

            // Crear y renderizar el gráfico
            window.chart6 = crearGrafico6(categories_M_6, values_M_6, categories_V_6, values_V_6);
            window.chart6.render();
        })
        .catch(error6 => {
            document.getElementById("grafico6").textContent = `Error: ${error6.message}`;
        });
};

function actualizarGrafico6() {
    cargarDatos(archivo6)
        .then(data6 => {
            const parsedData6 = parsearDatos(data6);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado6 = document.getElementById("Anio6").value;
            const datosFiltrados6 = filtrarPorAnio(parsedData6, anioSeleccionado6);

            actualizarSubtitulo6(); // Actualizá también el subtítulo

            // Procesar datos
            const { categories_M_6, values_M_6, categories_V_6, values_V_6 } = procesarDatos6(datosFiltrados6);

            // Actualizar las series y categorías con animación
            window.chart6.updateOptions({
                ...window.chart6.w.config, // Copia las opciones actuales
                series: [{ data: [...values_M_6] }, { data: [...values_V_6] }],
                xaxis: {
                    categories: [...categories_M_6]
                }
            });
        })
        .catch(error => {
            document.getElementById("grafico6").textContent = `Error: ${error.message}`;
        });
};

function actualizarSubtitulo6() {
    const anioSeleccionado = document.getElementById("Anio6").value;
    const subtitulo = document.getElementById("subtitulo6");
    subtitulo.innerHTML = `<i>Por género. Por trimestre. Provincia de Salta. Año ${anioSeleccionado}.</i>`;
}

// 6. Función para configurar y renderizar el gráfico
function crearGrafico6(categories_M, values_M, categories_V, values_V) {
    return new ApexCharts(document.querySelector("#grafico6"), {
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
                text: "Tasa de subocupación"
            },
            min: 0,
            max: 30
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