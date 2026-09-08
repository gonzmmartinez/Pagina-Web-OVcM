// Datos
const archivo4 = "../../datos/json/denuncias_911_dia.json";

// PROCESAMIENTO
function procesarDatos4(data) {
    // Inicializar un objeto para organizar los datos por año
    const aniosAgrupados = {};

    // Iterar sobre los datos para organizarlos
    data.forEach(({ Año, Dia, Cantidad, Porcentaje }) => {
        if (!aniosAgrupados[Año]) {
            aniosAgrupados[Año] = [];
        }

        aniosAgrupados[Año].push({
            x: Dia,
            y: Porcentaje,
            cantidad: Cantidad
        });
    });

    // Convertir el objeto organizado al formato solicitado
    const series = Object.keys(aniosAgrupados).map(anio => ({
        name: anio,
        data: aniosAgrupados[anio]
    }));

    return series;
}

// FILTRAR DATOS
function filtrarPorAccion(data, accion) {
    return data.filter(item => item.Accion === accion);
}

// INICIALIZACIÓN
function iniciar4() {
    cargarDatos(archivo4)
        .then(data4 => {
            const parsedData4 = parsearDatos(data4);

            // Filtrar por la acción seleccionada
            const accionSeleccionada4 = "Llamadas";
            const datosFiltrados4 = filtrarPorAccion(parsedData4, accionSeleccionada4);

            document.getElementById("subtitulo_chart4").innerHTML =
                `<i>${cambiarSubtitulo4(accionSeleccionada4)}</i>`;

            // Procesar los datos filtrados
            const series4 = procesarDatos4(datosFiltrados4);

            console.log(series4)

            // Crear y renderizar el gráfico
            window.chart4 = crearGrafico4(series4);
            window.chart4.render();
        })
        .catch(error1 => {
            document.getElementById("grafico4").textContent = `Error: ${error1.message}`;
        });
}

function actualizarGrafico4() {
    cargarDatos(archivo4)
        .then(data4 => {
            const parsedData4 = parsearDatos(data4);

            // Filtrar por la acción seleccionada
            const accionSeleccionada4 = document.getElementById("Accion4").value;
            const datosFiltrados4 = filtrarPorAccion(parsedData4, accionSeleccionada4);

            document.getElementById("subtitulo_chart4").innerHTML =
                `<i>${cambiarSubtitulo4(accionSeleccionada4)}</i>`;

            // Procesar datos
            const series4 = procesarDatos4(datosFiltrados4);

            // Actualizar las series
            window.chart4.updateOptions({
                ...window.chart4.w.config,
                series: [...series4]
            });
        })
        .catch(error => {
            document.getElementById("grafico4").textContent = `Error: ${error.message}`;
        });
}

// Función para actualizar dinámicamente el subtítulo
function cambiarSubtitulo4(accion) {
    let texto = "";

    switch (accion) {
        case "Llamadas":
            texto = "Llamadas al S.E. 911";
            break;
        case "Intervenciones":
            texto = "Intervenciones del S.E. 911";
            break;
        case "Intervenciones SAMEC":
            texto = "Intervenciones del S.E. 911 conjuntamente con agencia SAMEC";
            break;
        default:
            texto = "";
    }

    return texto += ", por día de la semana. Provincia de Salta.";
}

// Función para configurar y renderizar el gráfico
function crearGrafico4(series) {

    const colores = [
        "#e6bc75", "#e7a071", "#e18675", "#d36f7e", "#bc5e87",
        "#9c538f", "#754c91", "#45478c", "#42264d", "#23101c"
    ];

    // Rangos
    const min = 8.68;
    const max = 25.45;
    const numDivisiones = 10;

    const paso = (max - min) / numDivisiones;

    const ranges = Array.from({ length: numDivisiones }, (_, i) => {
        const from = min + i * paso;
        const to = i === numDivisiones - 1
            ? max
            : min + (i + 1) * paso;

        return {
            from,
            to,
            color: colores[i]
        };
    });

    return new ApexCharts(document.querySelector("#grafico4"), {
        chart: {
            type: 'heatmap',
            height: '500px',
            toolbar: {
                show: false
            }
        },

        series: series,

        title: {},

        yaxis: {
            title: {
                text: "Año"
            }
        },

        xaxis: {
            title: {
                text: "Día"
            }
        },

        tooltip: {
            enabled: true,
            followCursor: true,
            y: {
                formatter: function (value, { seriesIndex, dataPointIndex, w }) {

                    const cantidad =
                        w.config.series[seriesIndex].data[dataPointIndex].cantidad;

                    const porcentaje = value.toFixed(1);

                    return `${porcentaje}% (${cantidad.toLocaleString("es-AR")})`;
                }
            }
        },

        legend: {
            show: false,
            position: 'right',
            horizontalAlign: 'center',
            fontSize: '12px',
            fontWeight: 300,
            itemMargin: {
                horizontal: 4,
                vertical: 0
            },
            markers: {
                size: 6,
                strokeWidth: 0
            },
            labels: {
                colors: '#555',
                useSeriesColors: false
            }
        },

        dataLabels: {
            enabled: true,
            offsetY: 1,
            style: {
                fontSize: '0.75rem'
            },
            formatter: function (value) {
                return `${value.toFixed(1).toLocaleString("es-AR")}%`
            }
        },

        plotOptions: {
            heatmap: {
                enableShades: false,
                radius: 0,
                useFillColorAsStroke: true,
                colorScale: {
                    ranges: ranges
                }
            }
        }
    });
}