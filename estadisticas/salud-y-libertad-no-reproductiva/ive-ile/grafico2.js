// Datos
const archivo2 = "../../datos/json/salud_ive_ile_edad.json";

// PROCESAMIENTO
function procesarDatos2(data) {

    const data_IVE = data.filter(item => item.Tipo === "IVE");
    const data_ILE = data.filter(item => item.Tipo === "ILE");

    const categories = data_IVE.map(item => item.Rango_etario_pg);
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
function iniciar2() {
    cargarDatos(archivo2) // Cargar los datos del JSON
        .then(data2 => {
            // Parsear los datos
            const parsedData2 = parsearDatos(data2);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado2 = "2025";
            const datosFiltrados2 = filtrarPorAnio(parsedData2, anioSeleccionado2);

            // Procesar los datos filtrados
            const { categories, values_IVE, values_ILE } = procesarDatos2(datosFiltrados2);

            console.log(datosFiltrados2);

            // Crear y renderizar el gráfico
            window.chart2 = crearGrafico2(categories, values_IVE, values_ILE);
            window.chart2.render();
        })
        .catch(error1 => {
            document.getElementById("grafico2").textContent = `Error: ${error1.message}`;
        });
};

function actualizarGrafico2() {
    cargarDatos(archivo2)
        .then(data2 => {
            const parsedData2 = parsearDatos(data2);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado2 = document.getElementById("Anio2").value;
            const datosFiltrados2 = filtrarPorAnio(parsedData2, anioSeleccionado2);

            // Procesar datos
            const { categories, values_IVE, values_ILE } = procesarDatos2(datosFiltrados2);

            // Actualizar las series y categorías con animación
            window.chart2.updateOptions({
                ...window.chart2.w.config, // Copia las opciones actuales
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
            document.getElementById("grafico2").textContent = `Error: ${error.message}`;
        });
};

// 5. Función para configurar y renderizar el gráfico
function crearGrafico2(categories, values_IVE, values_ILE) {
    return new ApexCharts(document.querySelector("#grafico2"), {
        chart: {
            type: 'bar',
            height: '350px',
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
                text: "Rango etario"
            },
            categories: categories
        },
        tooltip: {
            enabled: true,
            followCursor: true,
        },
        plotOptions: {
            bar: {
                columnWidth: '90%',
                dataLabels: {
                    position: 'top'
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (value) {
                return value.toLocaleString("es-AR");
            },
            offsetY: -20,
            style: {
                colors: ['#545454']
            }
        }
    });
};