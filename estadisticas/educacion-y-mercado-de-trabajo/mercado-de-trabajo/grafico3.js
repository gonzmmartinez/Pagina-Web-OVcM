// Datos
const archivo3 = "../../datos/json/trabajo_subocupacion.json";

// Función para procesar los datos y agruparlos por Año-Trimestre
function procesarDatos3(data3) {
    // Filtrar por género
    const data_M = data3.filter(item => item.Género === "Mujeres");
    const data_V = data3.filter(item => item.Género === "Varones");

    // Armar categorías dinámicamente (para labels tipo "1-20", "2-20", etc)
    const categories = data_M.map(item => {
        const anioShort = item.Año.toString().slice(-2);
        return `${item.Trimestre}-${anioShort}`;
    });

    // Series con arrays planos de valores
    const values_M_3 = data_M.map(item => item.Tasa_Subocupacion);
    const values_V_3 = data_V.map(item => item.Tasa_Subocupacion);

    return { categories, values_M_3, values_V_3, data_M, data_V };
}

// INICIALIZACIÓN
function iniciar3() {
    cargarDatos(archivo3)
        .then(data3 => {
            const parsedData3 = parsearDatos(data3);
            const { categories, values_M_3, values_V_3, data_M, data_V } = procesarDatos3(parsedData3);

            // Crear y renderizar el gráfico
            window.chart3 = crearGrafico3(categories, values_M_3, values_V_3, data_M);
            window.chart3.render();
        })
        .catch(error3 => {
            document.getElementById("grafico3").textContent = `Error: ${error3.message}`;
        });
}

// Función para configurar y renderizar el gráfico
function crearGrafico3(categories, values_M, values_V, data_M) {
    return new ApexCharts(document.querySelector("#grafico3"), {
        chart: {
            type: 'line',
            height: '350px',
            toolbar: { show: false },   // desactiva todo el toolbar
            zoom: { enabled: false },   // desactiva zoom
            pan: { enabled: false },    // desactiva desplazamiento
            selection: { enabled: false } // desactiva selección
        },
        series: [
            { name: 'Tasa Mujeres', data: values_M },
            { name: 'Tasa Varones', data: values_V }
        ],
        colors: ["#45488d", "#e3753d"],
        yaxis: {
            title: { text: "Tasa de actividad" },
            min: 0,
            max: 30
        },
        xaxis: {
            type: 'category',
            categories: categories,
            title: { text: "Trimestre-Año" }
        },
        tooltip: {
            x: {
                formatter: function (val, { dataPointIndex }) {
                    const item = data_M[dataPointIndex]; // tomar el año y trimestre original
                    return `${item.Trimestre}°T ${item.Año}`;
                }
            }
        }
    });
}