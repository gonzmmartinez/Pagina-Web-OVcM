// Datos
const archivo4 = "../../datos/json/trabajo_desocupacion.json";

// Función para procesar los datos y agruparlos por Año-Trimestre
function procesarDatos4(data4) {
    // Filtrar por género
    const data_M = data4.filter(item => item.Género === "Mujeres");
    const data_V = data4.filter(item => item.Género === "Varones");

    // Armar categorías dinámicamente (para labels tipo "1-20", "2-20", etc)
    const categories = data_M.map(item => {
        const anioShort = item.Año.toString().slice(-2);
        return `${item.Trimestre}-${anioShort}`;
    });

    // Series con arrays planos de valores
    const values_M_4 = data_M.map(item => item.Tasa_Desocupacion);
    const values_V_4 = data_V.map(item => item.Tasa_Desocupacion);

    return { categories, values_M_4, values_V_4, data_M, data_V };
}

// INICIALIZACIÓN
function iniciar4() {
    cargarDatos(archivo4)
        .then(data4 => {
            const parsedData4 = parsearDatos(data4);
            const { categories, values_M_4, values_V_4, data_M, data_V } = procesarDatos4(parsedData4);

            // Crear y renderizar el gráfico
            window.chart4 = crearGrafico4(categories, values_M_4, values_V_4, data_M);
            window.chart4.render();
        })
        .catch(error4 => {
            document.getElementById("grafico4").textContent = `Error: ${error4.message}`;
        });
}

// Función para configurar y renderizar el gráfico
function crearGrafico4(categories, values_M, values_V, data_M) {
    return new ApexCharts(document.querySelector("#grafico4"), {
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
            max: 17.5
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