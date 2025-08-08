// Datos
const archivo7 = "../datos/json/trabajo_desocupacion.json";

// 4. Función para procesar los datos y agruparlos por Año-Trimestre
function procesarDatos7(data7) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories_M_7 = [];
    const values_M_7 = [];
    const categories_V_7 = [];
    const values_V_7 = [];

    // Filtrar los datos por género
    const data_M = data7.filter(item => item.Género === "Mujeres");
    const data_V = data7.filter(item => item.Género === "Varones");

    // Procesar los datos para mujeres
    data_M.forEach(item => {
        categories_M_7.push(item.Trimestre);  // Añadir year_trimestre al eje X
        values_M_7.push(item.Tasa_Desocupacion);      // Añadir Tasa_actividad al eje Y
    });

    // Procesar los datos para varones
    data_V.forEach(item => {
        categories_V_7.push(item.Trimestre);  // Añadir year_trimestre al eje X
        values_V_7.push(item.Tasa_Desocupacion);      // Añadir Tasa_actividad al eje Y
    });

    return { categories_M_7, values_M_7, categories_V_7, values_V_7 };
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
};

// INICIALIZACIÓN
function iniciar7() {
    return cargarDatos(archivo7)
        .then(data7 => {
            const parsedData7 = parsearDatos(data7);

            const { categories_M_7, values_M_7, categories_V_7, values_V_7 } = procesarDatos7(parsedData7);

            if (window.chart7) {
                try { window.chart7.destroy(); } catch (e) { }
            }

            const contenedor = document.querySelector("#grafico7");
            if (contenedor) contenedor.innerHTML = "";

            const chart = crearGrafico7(categories_M_7, values_M_7, categories_V_7, values_V_7);
            chart.render();
            window.chart7 = chart;

            return chart;
        })
        .catch(error7 => {
            document.getElementById("grafico7").textContent = `Error: ${error7.message}`;
            return null;
        });
}


// 7. Función para configurar y renderizar el gráfico
function crearGrafico7(categories_M, values_M, categories_V, values_V) {
    return new ApexCharts(document.querySelector("#grafico7"), {
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
                text: "Tasa de desocupación"
            },
            min: 0,
            max: 17.5
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