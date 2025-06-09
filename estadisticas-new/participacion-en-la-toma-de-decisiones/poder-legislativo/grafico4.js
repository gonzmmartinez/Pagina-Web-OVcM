// Datos
const archivo4 = "../../datos/json/poder_legislativo_senadores_prov.json";

// PROCESAMIENTO
function procesarDatos4(data) {
    // Crear los arrays para las categorías y los valores de las barras
    const categories_M_4 = [];
    const values_M_4 = [];
    const categories_V_4 = [];
    const values_V_4 = [];

    const data_M = data.filter(item => item.Género === "Mujeres");
    const data_V = data.filter(item => item.Género === "Varones");

    // Procesar los datos de cada entrada para mujeres
    data_M.forEach(item => {
        categories_M_4.push(item.Año);
        values_M_4.push(item.Cantidad);
    });

    // Procesar los datos de cada entrada para varones
    data_V.forEach(item => {
        categories_V_4.push(item.Año);
        values_V_4.push(item.Cantidad);
    });

    return { categories_M_4, values_M_4, categories_V_4, values_V_4 };
}

function filtrarPorDepartamento(data, departamento) {
    return data.filter(item => item.Departamento === departamento);
}

// INICIALIZACIÓN
function iniciar4() {
    cargarDatos(archivo4) // Cargar los datos del JSON
            .then(data4 => {
                // Parsear los datos
                const parsedData4 = parsearDatos(data4);
                
                // Filtrar por el departamento seleccionado
                const deptoSeleccionado4 = "TODOS"
                const datosFiltrados4 = filtrarPorDepartamento(parsedData4, deptoSeleccionado4);
                
                // Procesar los datos filtrados
                const { categories_M_4, values_M_4, categories_V_4, values_V_4 } = procesarDatos4(datosFiltrados4);
    
                // Crear y renderizar el gráfico
                window.chart4 = crearGrafico4(categories_M_4, values_M_4, categories_V_4, values_V_4);
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

        // Filtrar por el departamento seleccionado
        const deptoSeleccionado4 = document.getElementById("Depto4").value;
        const datosFiltrados4 = filtrarPorDepartamento(parsedData4, deptoSeleccionado4);

        // Procesar datos
        const { categories_M_4, values_M_4, categories_V_4, values_V_4 } = procesarDatos4(datosFiltrados4);

        // Actualizar las series y categorías con animación
        window.chart4.updateOptions({
            ...window.chart4.w.config, // Copia las opciones actuales
            series: [{data: [...values_M_4]}, {data: [...values_V_4]}]});
    })
    .catch(error => {
        document.getElementById("grafico4").textContent = `Error: ${error.message}`;
    });
}

// Configurar las opciones
function crearGrafico4(categories_M, values_M, categories_V, values_V) {
    return new ApexCharts(document.querySelector("#grafico4"), {
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