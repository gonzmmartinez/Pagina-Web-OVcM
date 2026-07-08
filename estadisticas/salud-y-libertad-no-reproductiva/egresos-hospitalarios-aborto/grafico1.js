// Datos
const archivo1 = "../../datos/json/salud_abortos_causas.json";

// PROCESAMIENTO
function procesarDatos1(data) {

    const categories1 = [...new Set(data.map(d => d.Año))]
        .sort((a, b) => a - b);

    const causas = [...new Set(data.map(d => d.Causa))];

    const mapa = {};

    data.forEach(d => {
        if (!mapa[d.Causa]) mapa[d.Causa] = {};
        mapa[d.Causa][d.Año] = d.Cantidad;
    });

    const series1 = causas.map(causa => ({
        name: causa,
        data: categories1.map(anio => mapa[causa][anio] ?? 0)
    }));

    return {
        categories1,
        series1
    };
}

// INICIALIZACIÓN
function iniciar1() {
    cargarDatos(archivo1) // Cargar los datos del JSON
        .then(data1 => {
            // Parsear los datos
            const parsedData1 = parsearDatos(data1);

            // Procesar los datos filtrados
            const { categories1, series1 } = procesarDatos1(parsedData1);

            console.log(series1)

            // Crear y renderizar el gráfico
            window.chart1 = crearGrafico1(categories1, series1);
            window.chart1.render();
        })
        .catch(error1 => {
            document.getElementById("grafico1").textContent = `Error: ${error1.message}`;
        });
};

function actualizarGrafico1() {
    cargarDatos(archivo1)
        .then(data1 => {
            const parsedData1 = parsearDatos(data1);

            // Procesar datos
            const { categories1, series1 } = procesarDatos1(parsedData1);

            document.getElementById("subtitulo_chart1").innerHTML =
                `<i>${cambiarSubtitulo1(anioSeleccionado1)}</i>`;

            // Actualizar las series y categorías con animación
            window.chart1.updateOptions({
                xaxis: {
                    categories: categories1
                },
                series: series1
            });
        })
        .catch(error => {
            document.getElementById("grafico1").textContent = `Error: ${error.message}`;
        });
};

// 5. Función para configurar y renderizar el gráfico
function crearGrafico1(categories, series) {
    return new ApexCharts(document.querySelector("#grafico1"), {
        chart: {
            type: 'bar',
            stacked: true,
            height: '350px',
            toolbar: {
                show: false
            }
        },
        series: series,
        title: {},
        colors: ["#e3753d", "#1468b1", "#a9a226", "#e3474b", "#45488d", "#e3753d", "#e3a22e"],
        yaxis: {
            title: {
                text: "Cantidad"
            },
            labels: {
                formatter: function (value) {
                    return value.toLocaleString("es-AR");
                }
            }
        },
        xaxis: {
            title: {
                text: "Año"
            },
            categories: categories
        },
        tooltip: {
            enabled: true,
            followCursor: true,
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    position: 'center',
                    total: {
                        enabled: true,
                        offsetX: 0,
                        offsetY: -10,
                        style: {
                            colors: ['#000000'],
                            fontSize: '13px',
                            fontWeight: 900,
                        },
                    },
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (value) {
                return value.toLocaleString("es-AR");
            },
            style: {
                colors: ['#ffffff'],
                fontWeight: 600
            }
        }
    });
};

// Función para actualizar dinámicamente el subtítulo
function cambiarSubtitulo1(anio) {
    let texto = "Por departamento. Provincia de Salta.";

    if (anio) {
        texto += ` Año ${anio}`;
    }

    return texto;
}

// INICIALIZAR
window.addEventListener("load", iniciar1);