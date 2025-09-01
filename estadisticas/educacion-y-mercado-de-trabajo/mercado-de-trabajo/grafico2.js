// Datos
const archivo2 = "../../datos/json/trabajo_empleo.json";

// Función para procesar los datos y agruparlos por Año-Trimestre
function procesarDatos2(data2) {
    // Filtrar por género
    const data_M = data2.filter(item => item.Género === "Mujeres");
    const data_V = data2.filter(item => item.Género === "Varones");

    // Armar categorías dinámicamente (para labels tipo "1-20", "2-20", etc)
    const categories = data_M.map(item => {
        const anioShort = item.Año.toString().slice(-2);
        return `${item.Trimestre}-${anioShort}`;
    });

    // Series con arrays planos de valores
    const values_M_2 = data_M.map(item => item.Tasa_Empleo);
    const values_V_2 = data_V.map(item => item.Tasa_Empleo);

    return { categories, values_M_2, values_V_2, data_M, data_V };
}

// INICIALIZACIÓN
function iniciar2() {
    cargarDatos(archivo2)
        .then(data2 => {
            const parsedData2 = parsearDatos(data2);
            const { categories, values_M_2, values_V_2, data_M, data_V } = procesarDatos2(parsedData2);

            // Crear y renderizar el gráfico
            window.chart2 = crearGrafico2(categories, values_M_2, values_V_2, data_M);
            window.chart2.render();
        })
        .catch(error2 => {
            document.getElementById("grafico2").textContent = `Error: ${error2.message}`;
        });
}

// Función para configurar y renderizar el gráfico
function crearGrafico2(categories, values_M, values_V, data_M) {
    return new ApexCharts(document.querySelector("#grafico2"), {
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
            min: 20,
            max: 80
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