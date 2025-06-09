// Datos
const archivo3 = "../../datos/json/denuncias_911_violencia_accion.json";

// PROCESAMIENTO
function procesarDatos3(data) {
    const categories3 = [];
    const values3a = [0, 0, 0];
    const values3b = [0, 0, 0];
    const values3c = [0, 0, 0];

    if (!data || !Array.isArray(data)) {
        return { categories3, values3a, values3b, values3c }; // Arrays vacíos para evitar errores
    }

    const accionesUnicas = Array.from(new Set(data.map(item => item.Accion)));
    categories3.push(...accionesUnicas);

    // Procesar los datos con validaciones
    data.forEach(item => {
        if (!item.Accion || !item.Tipo || typeof item.Cantidad !== 'number') {
            console.warn("Elemento inválido en datos:", item);
            return;
        }

        const accionIndex = accionesUnicas.indexOf(item.Accion);
        if (accionIndex === -1) return;

        if (item.Tipo === "Violencia de género") {
            values3a[accionIndex] += item.Cantidad;
        } else if (item.Tipo === "Violencia familiar en curso") {
            values3b[accionIndex] += item.Cantidad;
        } else if (item.Tipo === "Violencia familiar histórica") {
            values3c[accionIndex] += item.Cantidad;
        }
    });

    return { categories3, values3a, values3b, values3c };
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
            const anioSeleccionado3 = "2024";
            const datosFiltrados3 = filtrarPorAnio(parsedData3, anioSeleccionado3);

            // Procesar los datos filtrados
            const { categories3, values3a, values3b, values3c } = procesarDatos3(datosFiltrados3);

            // Crear y renderizar el gráfico
            window.chart3 = crearGrafico3(categories3, values3a, values3b, values3c);
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

            // Obtener el año seleccionado
            const anioSeleccionado3 = document.getElementById("Anio3").value;

            // Filtrar y procesar los datos
            const datosFiltrados3 = filtrarPorAnio(parsedData3, anioSeleccionado3);
            const { categories3, values3a, values3b, values3c } = procesarDatos3(datosFiltrados3);

            // Actualizar directamente las opciones
            window.chart3.updateOptions({
                ...window.chart3.w.config, // Copia las opciones actuales
                series: [
                    {data: [...values3a]},
                    {data: [...values3b]},
                    {data: [...values3c]}
                ]
            })
        })
        .catch(error => {
            document.getElementById("grafico3").textContent = `Error en actualizarGrafico3: ${error.message}`;
        });
}


// 5. Función para configurar y renderizar el gráfico
function crearGrafico3(categories, valuesa, valuesb, valuesc) {
    return new ApexCharts(document.querySelector("#grafico3"), {
        chart: {
            type: 'bar',
            height: '350px',
            toolbar: {
              show: false
            }
        },
        series: [
            {name: "Violencia de género", data: valuesa},
            {name: "Violencia familiar en curso", data: valuesb},
            {name: "Violencia familiar histórica", data: valuesc}
        ],
        title: {},
        colors: ["#e3474b", "#45488d", "#1468b1", "#e3753d", "#e3a22e", "#1468b1", "#45488d"],
        yaxis: {
            title: {
                text: "Cantidad"
            }
        },
        xaxis: {
            title: {
                text: "Requerimiento"
            },
            categories: categories,
        },
        tooltip: {
            enabled: true,
            followCursor: true,
            y: {
                formatter: function(value) {
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
            }
        },
        legend: {
            position: "top",
            horizontalAlign: 'left',
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '0.75rem'
            },
            formatter: function(value) {
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            }
        }
    })
};