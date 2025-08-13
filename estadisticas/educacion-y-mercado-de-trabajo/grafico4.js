// Datos
const archivo4 = "../datos/json/trabajo_actividad.json";

// 4. Función para procesar los datos y agruparlos por Año-Trimestre
function procesarDatos4(data4) {
    const categoriasSet = new Set();
    const valoresM = new Map();
    const valoresV = new Map();

    data4.forEach(item => {
        // Clave única combinando trimestre y año corto, ejemplo: '1-20'
        const key = item.year_trimestre ?? (item.Trimestre + "-" + item.Año.slice(-2));
        categoriasSet.add(key);

        if (item.Género === "Mujeres") valoresM.set(key, item.Tasa_Actividad);
        else if (item.Género === "Varones") valoresV.set(key, item.Tasa_Actividad);
    });

    // Ordenar categorías por año y trimestre
    const categories = Array.from(categoriasSet).sort((a, b) => {
        const [tA, yA] = a.split("-");
        const [tB, yB] = b.split("-");
        if (yA !== yB) return yA - yB;
        return tA - tB;
    });

    // Mapear valores para cada categoría
    const values_M_4 = categories.map(cat => valoresM.get(cat) ?? null);
    const values_V_4 = categories.map(cat => valoresV.get(cat) ?? null);

    // Contar trimestres por año para grupos
    const yearCounts = categories.reduce((acc, cat) => {
        const year = cat.split("-")[1];
        acc[year] = (acc[year] || 0) + 1;
        return acc;
    }, {});

    // Crear grupos para ApexCharts
    const groups = Object.entries(yearCounts).map(([year, count]) => ({
        title: "20" + year,
        cols: count
    }));

    return { categories, values_M_4, values_V_4, groups };
}


// INICIALIZACIÓN
function iniciar4() {
    cargarDatos(archivo4) // Cargar los datos del JSON
        .then(data4 => {
            // Parsear los datos
            const parsedData4 = parsearDatos(data4);

<<<<<<< Updated upstream
            actualizarSubtitulo4();

            // Procesar los datos filtrados
            const { categories_M_4, values_M_4, categories_V_4, values_V_4 } = procesarDatos4(parsedData4);
=======
            // Procesar los datos filtrados
            const { categories, values_M_4, values_V_4, groups } = procesarDatos4(parsedData4);
>>>>>>> Stashed changes

            console.log(groups)

            window.chart4 = crearGrafico4(categories, values_M_4, values_V_4, groups);
            window.chart4.render();
        })
        .catch(error4 => {
            document.getElementById("grafico4").textContent = `Error: ${error4.message}`;
        });
};

function actualizarGrafico4() {
    cargarDatos(archivo4)
        .then(data4 => {
            const parsedData4 = parsearDatos(data4);

            // Procesar datos
            const { categories, values_M_4, values_V_4, groups } = procesarDatos4(parsedData4);

            // Actualizar las series y categorías con animación
            window.chart4.updateOptions({
                ...window.chart4.w.config,
                series: [{ data: [...values_M_4] }, { data: [...values_V_4] }],
                xaxis: {
                    categories: [...categories],
                    group: { groups: [...groups] }
                }
            });

        })
        .catch(error => {
            document.getElementById("grafico4").textContent = `Error: ${error.message}`;
        });
};

function actualizarSubtitulo4() {
    const anioSeleccionado = document.getElementById("Anio4").value;
    const subtitulo = document.getElementById("subtitulo4");
    subtitulo.innerHTML = `<i>Por género. Por trimestre. Provincia de Salta. Año ${anioSeleccionado}.</i>`;
}

// 5. Función para configurar y renderizar el gráfico
function crearGrafico4(categories, values_M_4, values_V_4, groups) {
    return new ApexCharts(document.querySelector("#grafico4"), {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
<<<<<<< Updated upstream
                show: false,
                autoSelected: 'pan'
=======
                show: true,
                autoSelected: 'pan',
                tools: {
                    zoom: true,
                    pan: true,
                    zoomin: true,
                    zoomout: true,
                    reset: true,
                    selection: false  // si querés desactivar la selección de área
                }
            },
            zoom: {
                enabled: true,
                type: 'x',       // zoom solo en eje X
                autoScaleYaxis: true // opcional para ajustar el eje Y
>>>>>>> Stashed changes
            }
        },
        series: [
            { name: 'Tasa Mujeres', data: values_M_4 },
            { name: 'Tasa Varones', data: values_V_4 }
        ],
        colors: ["#45488d", "#e3753d"],
        yaxis: {
            title: { text: "Tasa de actividad" },
            min: 20,
            max: 80
        },
        xaxis: {
            type: 'category',
            categories: [...categories],
            group: {
                style: {
                    fontSize: '12px',
                    fontWeight: 700
                },
                groups: [...groups]
            }
        },
        tooltip: {
            enabled: true,
            followCursor: true
        }
    });
}
