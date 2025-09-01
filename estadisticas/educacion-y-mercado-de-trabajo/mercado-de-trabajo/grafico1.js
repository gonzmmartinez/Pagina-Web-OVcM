// Datos
const archivo1 = "../../datos/json/trabajo_actividad.json";

// Función para procesar los datos y agruparlos por Año-Trimestre
function procesarDatos1(data1) {
    // Filtrar por género
    const data_M = data1.filter(item => item.Género === "Mujeres");
    const data_V = data1.filter(item => item.Género === "Varones");

    // Armar categorías dinámicamente (para labels tipo "1-20", "2-20", etc)
    const categories = data_M.map(item => {
        const anioShort = item.Año.toString().slice(-2);
        return `${item.Trimestre}-${anioShort}`;
    });

    // Series con arrays planos de valores
    const values_M_1 = data_M.map(item => item.Tasa_Actividad);
    const values_V_1 = data_V.map(item => item.Tasa_Actividad);

    return { categories, values_M_1, values_V_1, data_M, data_V };
}

// INICIALIZACIÓN
function iniciar1() {
    cargarDatos(archivo1)
        .then(data1 => {
            const parsedData1 = parsearDatos(data1);
            const { categories, values_M_1, values_V_1, data_M, data_V } = procesarDatos1(parsedData1);

            // Crear y renderizar el gráfico
            window.chart1 = crearGrafico1(categories, values_M_1, values_V_1, data_M);
            window.chart1.render();
        })
        .catch(error1 => {
            document.getElementById("grafico1").textContent = `Error: ${error1.message}`;
        });
}

// Función para configurar y renderizar el gráfico
function crearGrafico1(categories, values_M, values_V, data_M) {
    return new ApexCharts(document.querySelector("#grafico1"), {
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

// LLAMAR FUNCIÓN AL INICIALIZAR
window.addEventListener("load", iniciar1);
