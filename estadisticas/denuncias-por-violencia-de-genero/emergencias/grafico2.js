// Datos
const archivo2 = "../../datos/json/denuncias_911_por_mes.json";

// PROCESAMIENTO
function procesarDatos2(data) {
    return data.map(item => ({
        x: new Date(item.Fecha).getTime(), // timestamp para datetime
        y: item.Cantidad
    }));
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
}

// INICIALIZACIÓN
function iniciar2() {
    cargarDatos(archivo2)
        .then(data2 => {
            const parsedData2 = parsearDatos(data2);
            const values2 = procesarDatos2(parsedData2);
            window.chart2 = crearGrafico2(values2);
            window.chart2.render();
        })
        .catch(error1 => {
            document.getElementById("grafico2").textContent = `Error: ${error1.message}`;
        });
}

function actualizarGrafico2() {
    cargarDatos(archivo2)
        .then(data2 => {
            const parsedData2 = parsearDatos(data2);
            const anioSeleccionado2 = document.getElementById("Anio2").value;
            const datosFiltrados2 = filtrarPorAnio(parsedData2, anioSeleccionado2);
            const values2 = procesarDatos2(datosFiltrados2);
            window.chart2.updateSeries([{ data: values2 }]);
        })
        .catch(error => {
            document.getElementById("grafico2").textContent = `Error: ${error.message}`;
        });
}

// CREAR GRÁFICO
function crearGrafico2(values) {
    return new ApexCharts(document.querySelector("#grafico2"), {
        chart: {
            type: 'area',
            height: 350,
            zoom: {
                enabled: true,
                type: 'x',
                autoScaleYaxis: false
            },
            toolbar: {
                autoSelected: 'pan',
                show: false,
            },
            defaultLocale: 'es',
            locales: [{
                name: 'es',
                options: {
                    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                    toolbar: {
                        download: 'Descargar SVG',
                        selection: 'Selección',
                        selectionZoom: 'Zoom de selección',
                        zoomIn: 'Acercar',
                        zoomOut: 'Alejar',
                        pan: 'Desplazar',
                        reset: 'Reiniciar Zoom',
                    }
                }
            }],
            events: {
                mounted: function (chartContext) {
                    chartContext.updateOptions({
                        dataLabels: { enabled: false }
                    });
                },
                zoomed: function (chartContext, { xaxis }) {
                    const cantidadMeses = (xaxis.max - xaxis.min) / 2629800000; // ~30.44 días promedio
                    chartContext.updateOptions({
                        dataLabels: {
                            enabled: cantidadMeses <= 15
                        }
                    });
                },
                beforeResetZoom: function (chartContext) {
                    chartContext.updateOptions({
                        dataLabels: { enabled: false }
                    });
                }
            }
        },
        series: [{
            name: 'Cantidad',
            type: 'area',
            data: values
        }],
        colors: ["#1468b1"],
        yaxis: {
            title: {
                text: "Cantidad"
            },
            labels: {
                formatter: function (value) {
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
            },
            min: 5000,
            max: 25000
        },
        xaxis: {
            type: "datetime",
            title: {
                text: "Mes",
                offsetY: 30
            },
            labels: {
                style: {
                    fontSize: "0.75rem"
                },
                datetimeFormatter: {
                    year: "yyyy",
                    month: "MMM-yy",
                    day: " ",
                    hour: " "
                }
            },
            tooltip: {
                enabled: true
            }
        },
        tooltip: {
            enabled: true,
            followCursor: true,
            x: {
                format: "MMMM yyyy"
            },
            y: {
                formatter: function (value) {
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
            }
        },
        stroke: {
            curve: "straight"
        },
        dataLabels: {
            enabled: false,
            formatter: function (value) {
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            style: {
                fontSize: '0.65rem',
            },
        },
        markers: {
            size: 4
        }
    });
}
