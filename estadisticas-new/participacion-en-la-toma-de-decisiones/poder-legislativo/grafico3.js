// Datos
const archivo3 = "../../datos/json/poder_legislativo_diputados_prov.json";

// PROCESAMIENTO
function procesarDatos3(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories_M_3 = [];
    const values_M_3 = [];
    const categories_V_3 = [];
    const values_V_3 = [];

    const data_M = data.filter(item => item.Género === "Mujeres");
    const data_V = data.filter(item => item.Género === "Varones");

    // Procesar los datos de cada entrada para mujeres
    data_M.forEach(item => {
        categories_M_3.push(item.Año);
        values_M_3.push(item.Cantidad);
    });

    // Procesar los datos de cada entrada para varones
    data_V.forEach(item => {
        categories_V_3.push(item.Año);
        values_V_3.push(item.Cantidad);
    });

    return { categories_M_3, values_M_3, categories_V_3, values_V_3 };
}

function filtrarPorDepartamento(data, departamento) {
    return data.filter(item => item.Departamento === departamento);
}

// INICIALIZACIÓN
function iniciar3() {
    cargarDatos(archivo3) // Cargar los datos del JSON
            .then(data3 => {
                // Parsear los datos
                const parsedData3 = parsearDatos(data3);
                
                // Filtrar por el departamento seleccionado
                const deptoSeleccionado3 = "TODOS"
                const datosFiltrados3 = filtrarPorDepartamento(parsedData3, deptoSeleccionado3);
                
                // Procesar los datos filtrados
                const { categories_M_3, values_M_3, categories_V_3, values_V_3 } = procesarDatos3(datosFiltrados3);
    
                // Crear y renderizar el gráfico
                window.chart3 = crearGrafico3(categories_M_3, values_M_3, categories_V_3, values_V_3);
                window.chart3.render();
            })
            .catch(error1 => {
                document.getElementById("grafico3").textContent = `Error: ${error1.message}`;
            });
}

function actualizarGrafico3() {
cargarDatos(archivo3)
    .then(data3 => {
        const parsedData3 = parsearDatos(data3);

        // Filtrar por el departamento seleccionado
        const deptoSeleccionado3 = document.getElementById("Depto3").value;
        const datosFiltrados3 = filtrarPorDepartamento(parsedData3, deptoSeleccionado3);

        // Procesar datos
        const { categories_M_3, values_M_3, categories_V_3, values_V_3 } = procesarDatos3(datosFiltrados3);

        // Actualizar las series y categorías con animación
        window.chart3.updateOptions({
            ...window.chart3.w.config, // Copia las opciones actuales
            series: [{data: [...values_M_3]}, {data: [...values_V_3]}]});
    })
    .catch(error => {
        document.getElementById("grafico3").textContent = `Error: ${error.message}`;
    });
}

// Configurar las opciones
function crearGrafico3(categories_M, values_M, categories_V, values_V) {
    return new ApexCharts(document.querySelector("#grafico3"), {
        chart: {
            type: 'bar',
            stacked: true,
            stackType: '100%',
            height: 350,
            toolbar: {
              show: false
            }
        },
        series: [{
            name: 'Mujeres',
            type: 'bar',
            data: values_M
        },{
            name: 'Varones',
            type: 'bar',
            data: values_V
        }],
        title: {},
        colors: ["#e3753d", "#45488d"],
        yaxis: {
            title: {
                text: "Porcentaje"
            },
            labels: {
                formatter: function(value) {
                    return value + "%"
                }
            }
        },
        xaxis: {
            title: {
                text: "Año"
            },
            categories: categories_M
        },
        tooltip: {
            enabled: true,
            shared: true,
            intersect: false,
            followCursor: true,
            y: {
                formatter: function(value) {
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                }
            }
        },
        dataLabels: {
            enabled: true,
            offsetY: 7.5,
            dropShadow: false,
            style: {
            fontSize: '1rem',
            fontWeight: 'bold',
            color: 'white'
            },
            formatter: function(value) {
                return Math.abs(Math.round(value * 10) / 10) + '%'
            }
        },
        legend: {
            position: 'top'
        }
    });
}