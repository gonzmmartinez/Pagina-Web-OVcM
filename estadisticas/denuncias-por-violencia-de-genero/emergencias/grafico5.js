// Datos
const archivo5 = "../../datos/json/denuncias_911_hora.json";

// PROCESAMIENTO
function procesarDatos5(data) {

    // Inicializar un objeto para organizar los datos por año
    const aniosAgrupados = {};

    // Iterar sobre los datos para organizarlos
    data.forEach(({ Año, Hora, Cantidad, Porcentaje }) => {

        if (!aniosAgrupados[Año]) {
            aniosAgrupados[Año] = [];
        }

        aniosAgrupados[Año].push({
            x: Hora,
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
function iniciar5() {

    cargarDatos(archivo5)
        .then(data5 => {

            const parsedData5 = parsearDatos(data5);

            // Filtrar por la acción seleccionada
            const accionSeleccionada5 = "Llamadas";
            const datosFiltrados5 =
                filtrarPorAccion(parsedData5, accionSeleccionada5);

            document.getElementById("subtitulo_chart5").innerHTML =
                `<i>${cambiarSubtitulo5(accionSeleccionada5)}</i>`;

            // Procesar los datos filtrados
            const series5 = procesarDatos5(datosFiltrados5);

            console.log(series5);

            // Crear y renderizar el gráfico
            window.chart5 = crearGrafico5(series5);
            window.chart5.render();
        })
        .catch(error1 => {
            document.getElementById("grafico5").textContent =
                `Error: ${error1.message}`;
        });
}

function actualizarGrafico5() {

    cargarDatos(archivo5)
        .then(data5 => {

            const parsedData5 = parsearDatos(data5);

            // Filtrar por la acción seleccionada
            const accionSeleccionada5 =
                document.getElementById("Accion5").value;

            const datosFiltrados5 =
                filtrarPorAccion(parsedData5, accionSeleccionada5);

            document.getElementById("subtitulo_chart5").innerHTML =
                `<i>${cambiarSubtitulo5(accionSeleccionada5)}</i>`;

            // Procesar datos
            const series5 = procesarDatos5(datosFiltrados5);

            // Actualizar las series
            window.chart5.updateOptions({
                ...window.chart5.w.config,
                series: [...series5]
            });
        })
        .catch(error => {
            document.getElementById("grafico5").textContent =
                `Error: ${error.message}`;
        });
}


// Función para actualizar dinámicamente el subtítulo
function cambiarSubtitulo5(accion) {
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

    return texto += ", por hora del día. Provincia de Salta.";
}

// FUNCIÓN PARA CONFIGURAR Y RENDERIZAR EL GRÁFICO
function crearGrafico5(series) {

    // Rangos de porcentaje
    const min = 0;
    const max = 10;

    const colores = [
        "#e6bc75", "#e8a671", "#e59173", "#dd7e78", "#d16d7f",
        "#bf5f86", "#a8568d", "#8c4f90", "#6b4b90", "#45478c",
        "#493872", "#452b59", "#3d2042", "#31172d", "#23101c"
    ];

    const numDivisiones = 15;
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

    return new ApexCharts(document.querySelector("#grafico5"), {

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
                text: "Hora"
            }
        },

        tooltip: {
            enabled: true,
            followCursor: true,

            y: {
                formatter: function (
                    value,
                    { seriesIndex, dataPointIndex, w }
                ) {

                    const cantidad =
                        w.config.series[seriesIndex]
                            .data[dataPointIndex]
                            .cantidad;

                    const porcentaje = value.toLocaleString("es-AR", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1
                    });

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
                fontSize: '0.5rem'
            },

            formatter: function (value) {

                return value.toLocaleString("es-AR", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                }) + "%";
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