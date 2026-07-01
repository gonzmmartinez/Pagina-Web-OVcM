// Datos
const archivo1 = "../../datos/json/salud_ive_ile_mes.json";

// PROCESAMIENTO
function procesarDatos1(data1, granularidad = "anio") {

    let datosProcesados = [];

    switch (granularidad) {

        case "mes":
            datosProcesados = data1.map(item => ({
                categoria: item.year_mes,
                tipo: item.Tipo,
                cantidad: Number(item.Cantidad) || 0,
                año: item.Año
            }));
            break;

        case "trimestre": {
            const agrupados = {};

            data1.forEach(item => {
                const key = `${item.year_trimestre}_${item.Tipo}`;

                if (!agrupados[key]) {
                    agrupados[key] = {
                        categoria: item.year_trimestre,
                        tipo: item.Tipo,
                        cantidad: 0,
                        año: item.Año
                    };
                }

                agrupados[key].cantidad += Number(item.Cantidad) || 0;
            });

            datosProcesados = Object.values(agrupados);
            break;
        }

        case "semestre": {
            const agrupados = {};

            data1.forEach(item => {
                const key = `${item.year_semestre}_${item.Tipo}`;

                if (!agrupados[key]) {
                    agrupados[key] = {
                        categoria: item.year_semestre,
                        tipo: item.Tipo,
                        cantidad: 0,
                        año: item.Año
                    };
                }

                agrupados[key].cantidad += Number(item.Cantidad) || 0;
            });

            datosProcesados = Object.values(agrupados);
            break;
        }

        case "anio": {
            const agrupados = {};

            data1.forEach(item => {
                const key = `${item.Año}_${item.Tipo}`;

                if (!agrupados[key]) {
                    agrupados[key] = {
                        categoria: item.Año.toString(),
                        tipo: item.Tipo,
                        cantidad: 0,
                        año: item.Año
                    };
                }

                agrupados[key].cantidad += Number(item.Cantidad) || 0;
            });

            datosProcesados = Object.values(agrupados);
            break;
        }
    }

    // Obtener categorías únicas conservando el orden
    const categories = [...new Set(datosProcesados.map(item => item.categoria))];

    // Índice de categorías
    const indiceCategorias = {};
    categories.forEach((cat, i) => {
        indiceCategorias[cat] = i;
    });

    // Inicializar las dos series
    const values_IVE = Array(categories.length).fill(0);
    const values_ILE = Array(categories.length).fill(0);

    // Completar las series
    datosProcesados.forEach(item => {
        const pos = indiceCategorias[item.categoria];

        if (item.tipo === "IVE") {
            values_IVE[pos] = item.cantidad;
        } else if (item.tipo === "ILE") {
            values_ILE[pos] = item.cantidad;
        }
    });

    // Construir grupos del eje X
    let groups1 = [];

    if (granularidad !== "anio") {

        const yearCounts = categories.reduce((acc, categoria) => {

            // Formato esperado: PERIODO-AÑO (ej. 01-24, 03-25)
            const año = categoria.split("-")[1];

            if (!acc[año]) {
                acc[año] = 0;
            }

            acc[año]++;

            return acc;

        }, {});

        groups1 = Object.entries(yearCounts).map(([year, count]) => ({
            title: `20${year}`,
            cols: count
        }));
    }

    return {
        categories,
        values_IVE,
        values_ILE,
        groups1
    };
}

// CONFIGURACIÓN
function crearGrafico1(categories, values_IVE, values_ILE, groups, granularidad) {

    // =========================
    // TÍTULO (se mantiene igual)
    // =========================

    let tituloX;
    let xLabelSize;
    let dataLabelsFontSize;

    switch (granularidad) {
        case "mes":
            tituloX = "Mes-Año";
            xLabelSize = '0.5rem'
            dataLabelsFontSize = '0.4rem'
            break;
        case "trimestre":
            tituloX = "Trimestre-Año";
            xLabelSize = '0.75rem'
            break;
        case "semestre":
            tituloX = "Semestre-Año";
            xLabelSize = '1rem'
            break;
        case "anio":
            tituloX = "Año";
            xLabelSize = '1.rem'
            break;
        default:
            tituloX = "";
            xLabelSize = '0.5rem';
            dataLabelsFontSize = '0.25rem'
    }

    // =========================
    // DINÁMICA POR CANTIDAD DE BARRAS
    // =========================

    const n = categories.length;

    const minBars = 2;
    const maxBars = 20;

    const maxFont = 1.5; // rem
    const minFont = 0.5; // rem

    const clamped = Math.min(Math.max(n, minBars), maxBars);
    const t = (clamped - minBars) / (maxBars - minBars);

    const fontSizeRem = maxFont - t * (maxFont - minFont);

    const fontSize = `${fontSizeRem.toFixed(2)}rem`;

    const hideDataLabels = n > 25;

    // mantenemos tu offset fijo (como pediste “misma lógica del otro gráfico”)
    const offsetX = -3;

    // =========================
    // X AXIS
    // =========================

    const xaxisConfig = {
        title: {
            text: tituloX
        },
        categories: categories,
        labels: {
            formatter: function (val) {

                if (!val || typeof val !== "string") {
                    return val ?? "";
                }

                if (granularidad === "mes") {

                    const iniciales = [
                        "E", "F", "M", "A", "M", "J",
                        "J", "A", "S", "O", "N", "D"
                    ];

                    const mes = parseInt(val.split("-")[0], 10);

                    return iniciales[mes - 1];
                }

                if (val.includes("-")) {
                    return parseInt(val.split("-")[0], 10);
                }

                return val;
            },
            style: {
                fontSize: xLabelSize
            }
        }
    };

    if (groups.length > 0) {
        xaxisConfig.group = {
            style: {
                fontSize: '0.75rem',
                fontWeight: 600
            },
            groups: groups
        };
    }

    // =========================
    // RETURN CHART
    // =========================

    return new ApexCharts(document.querySelector("#grafico1"), {

        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: false
            }
        },

        series: [
            {
                name: 'Cantidad IVE',
                type: 'column',
                data: values_IVE
            },
            {
                name: 'Cantidad ILE',
                type: 'column',
                data: values_ILE
            }
        ],

        colors: ["#a9a226", "#1468b1"],

        xaxis: xaxisConfig,

        yaxis: {
            title: {
                text: 'Cantidad'
            },
            labels: {
                formatter: function (value) {
                    return value.toLocaleString("es-AR");
                }
            }
        },

        dataLabels: {
            enabled: !hideDataLabels,
            textAnchor: 'start',
            offsetX: -3,
            style: {
                fontSize: dataLabelsFontSize,
                fontWeight: 'normal',
                colors: ['#545454']
            },
            formatter: function (value) {
                if (value === 0) {
                    return "";
                }
                return value.toLocaleString("es-AR");
            },
            offsetY: 5,
        },

        plotOptions: {
            bar: {
                columnWidth: '90%',
                dataLabels: {
                    position: 'top',
                    orientation: 'vertical'
                }
            }
        },

        tooltip: {
            enabled: true,
            shared: false,
            intersect: false,
            followCursor: true,
            x: {
                formatter: function (val) {

                    if (!val.includes("-")) {
                        return val;
                    }

                    const [periodo, year] = val.split("-");

                    switch (granularidad) {

                        case "mes": {
                            const meses = [
                                "Enero", "Febrero", "Marzo", "Abril",
                                "Mayo", "Junio", "Julio", "Agosto",
                                "Septiembre", "Octubre", "Noviembre", "Diciembre"
                            ];

                            return `${meses[parseInt(periodo, 10) - 1]} 20${year}`;
                        }

                        case "trimestre":
                            return `${parseInt(periodo, 10)}° Trimestre 20${year}`;

                        case "semestre":
                            return `${parseInt(periodo, 10)}° Semestre 20${year}`;

                        case "anio":
                            return `20${year}`;

                        default:
                            return val;
                    }
                }
            }
        },

        legend: {
            show: true
        }
    });
}

// INICIALIZACIÓN
function iniciar1() {
    cargarDatos(archivo1)
        .then(data1 => {

            const datosParseados1 = parsearDatos(data1);

            const granularidad =
                document.querySelector('input[name="granularidad"]:checked').value;

            document.getElementById("subtitulo_chart1").innerHTML =
                `<i>${cambiarSubtitulo1(granularidad)}</i>`;

            const { categories, values_IVE, values_ILE, groups1 } =
                procesarDatos1(datosParseados1, granularidad);

            window.chart1 =
                crearGrafico1(categories, values_IVE, values_ILE, groups1, granularidad);

            window.chart1.render().then(() => {
                document.querySelectorAll('#grafico1 .apexcharts-datalabel')
                    .forEach(el => {
                        el.setAttribute('dominant-baseline', 'middle');
                    });
            });

        })
        .catch(error1 => {
            document.getElementById("grafico1").textContent =
                `Error: ${error1.message}`;
        });
}

function actualizarGrafico1() {

    cargarDatos(archivo1)
        .then(data1 => {

            const datosParseados1 = parsearDatos(data1);

            const granularidad =
                document.querySelector('input[name="granularidad"]:checked').value;

            document.getElementById("subtitulo_chart1").innerHTML =
                `<i>${cambiarSubtitulo1(granularidad)}</i>`;

            const { categories, values_IVE, values_ILE, groups1 } =
                procesarDatos1(datosParseados1, granularidad);

            window.chart1.destroy();

            window.chart1 = crearGrafico1(
                categories,
                values_IVE,
                values_ILE,
                groups1,
                granularidad
            );

            window.chart1.render().then(() => {
                document.querySelectorAll('#grafico1 .apexcharts-datalabel')
                    .forEach(el => {
                        el.setAttribute('dominant-baseline', 'middle');
                    });
            });

        })
        .catch(error => {
            document.getElementById("grafico1").textContent =
                `Error: ${error.message}`;
        });
}

// Función para actualizar dinámicamente el subtítulo
function cambiarSubtitulo1(granularidad) {
    let texto = "";

    switch (granularidad) {
        case "mes":
            texto = "Serie mensual.";
            break;
        case "trimestre":
            texto = "Serie trimestral.";
            break;
        case "semestre":
            texto = "Serie semestral.";
            break;
        case "anio":
            texto = "Serie anual.";
            break;
        default:
            texto = "";
    }

    return texto += " Provincia de Salta.";
}

// Llamar la función principal al cargar la página
window.addEventListener("load", iniciar1);