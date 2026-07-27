// Datos
const archivo3 = "../../datos/json/salud_ive_ile_semanas.json";

// PROCESAMIENTO
function procesarDatos3(data) {

    const data_IVE = data.filter(item => item.Tipo === "IVE");
    const data_ILE = data.filter(item => item.Tipo === "ILE");

    const categories = data_IVE.map(item => item.Semanas);
    const values_IVE = data_IVE.map(item => item.Cantidad);
    const values_ILE = data_ILE.map(item => item.Cantidad);

    return {
        categories,
        values_IVE,
        values_ILE
    };
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
};

// INICIALIZACIÓN
function iniciar3() {
    cargarDatos(archivo3) // Cargar los datos del JSON
        .then(data3 => {
            // Parsear los datos
            const parsedData3 = parsearDatos(data3);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado3 = "2025";
            const datosFiltrados3 = filtrarPorAnio(parsedData3, anioSeleccionado3);

            // Procesar los datos filtrados
            const { categories, values_IVE, values_ILE } = procesarDatos3(datosFiltrados3);

            console.log(datosFiltrados3);

            // Crear y renderizar el gráfico
            window.chart3 = crearGrafico3(categories, values_IVE, values_ILE);
            window.chart3.render();
        })
        .catch(error1 => {
            document.getElementById("grafico3").textContent = `Error: ${error1.message}`;
        });
};

function actualizarGrafico3() {
    cargarDatos(archivo3)
        .then(data3 => {
            const parsedData3 = parsearDatos(data3);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado3 = document.getElementById("Anio3").value;
            const datosFiltrados3 = filtrarPorAnio(parsedData3, anioSeleccionado3);

            // Procesar datos
            const { categories, values_IVE, values_ILE } = procesarDatos3(datosFiltrados3);

            // Actualizar las series y categorías con animación
            window.chart3.updateOptions({
                ...window.chart3.w.config, // Copia las opciones actuales
                series: [
                    { data: [...values_IVE] },
                    { data: [...values_ILE] }
                ],
                xaxis: {
                    categories: [...categories]
                }
            });
        })
        .catch(error => {
            document.getElementById("grafico3").textContent = `Error: ${error.message}`;
        });
};

// 5. Función para configurar y renderizar el gráfico
function crearGrafico3(categories, values_IVE, values_ILE) {
    return new ApexCharts(document.querySelector("#grafico3"), {
        chart: {
            type: 'bar',
            height: '350px',
            stacked: true,
            toolbar: {
                show: false
            }
        },
        series: [{
            name: 'Cantidad IVE',
            type: 'bar',
            data: values_IVE
        },
        {
            name: 'Cantidad ILE',
            type: 'bar',
            data: values_ILE
        }],
        title: {},
        colors: ["#a9a226", "#1468b1", "#e3a22e", "#a9a226", "#e3474b", "#1468b1", "#45488d"],
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
                text: "Semanas de gestación"
            },
            categories: categories
        },
        tooltip: {
            enabled: true,
            followCursor: true,
            x: {
                formatter: function (val) {
                    return `${val} semanas`;
                }
            }
        },
        plotOptions: {
            bar: {
                columnWidth: '90%',
                dataLabels: {
                    position: 'top',
                    hideOverflowingLabels: false
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (value) {
                if (value === 0) {
                    return "";
                }

                return value.toLocaleString("es-AR");
            },
            offsetY: -7.5,
            style: {
                fontSize: '0.5rem',
                colors: ['#545454']
            },
        }
    });
};