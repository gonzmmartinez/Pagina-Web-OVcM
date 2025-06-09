// Datos
const archivo2 = "../datos/json/femicidios_localidad.json";

// PROCESAMIENTO
function procesarDatos2(data) {
    return data.map(item => ({
        name: item.Localidad,
        value: item.Cantidad
    }));
}

// FILTRAR DATOS
function filtrarFemicidiosPorAnio(data, year) {
    return data.filter(item => item.Año === year);
  }

// Función principal para inicializar el gráfico
function iniciar2() {
    const chartDom = document.getElementById('grafico2');
    const myChart = echarts.init(chartDom, null, {renderer: 'svg'});

    // Paso 1: Cargar los datos del archivo JSON
    cargarDatos(archivo2)
        .then(rawData2 => {
            // Paso 2: Parsear los datos
            const parsedData2 = parsearDatos(rawData2);

            // Paso 3: Filtrar o procesar los datos según la lógica específica
            const anioSeleccionado2 = "2024"; // Puedes reemplazarlo por el valor dinámico de un selector
            const datosFiltrados2 = filtrarFemicidiosPorAnio(parsedData2, anioSeleccionado2);

            const datosProcesados2 = procesarDatos2(datosFiltrados2);

            // Paso 4: Cargar el archivo GeoJSON de Salta
            return fetch('../datos/departamentos-salta.json')
                .then(response => response.json())
                .then(saltaJson => {
                    // Registrar el mapa de Salta
                    echarts.registerMap('Salta', { geoJSON: saltaJson });

                    // Paso 5: Crear las opciones del gráfico
                    const option = crearGrafico2(datosProcesados2);

                    // Establecer la configuración del gráfico
                    myChart.setOption(option);
                });
        })
        .catch(error => console.error('Error durante la inicialización del gráfico:', error));
};

// Función para actualizar el gráfico
function actualizarGrafico2() {
    const chartDom = document.getElementById('grafico2');
    const myChart = echarts.init(chartDom, null, {renderer: 'svg'});

    cargarDatos(archivo2)
    .then(rawData2 => {
        const parsedData2 = parsearDatos(rawData2);

        const anioSeleccionado2 = document.getElementById("Anio2").value;
        const datosFiltrados2 = filtrarFemicidiosPorAnio(parsedData2, anioSeleccionado2);

        const nuevosDatosProcesados2 = procesarDatos2(datosFiltrados2);

        myChart.setOption({
            series: [{
                data: nuevosDatosProcesados2
            }]
        })
    })
};

// Función para crear las opciones del gráfico
function crearGrafico2(data) {
    return {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} femicidios' // {b} es el nombre del departamento, {c} es el valor
        },
        toolbox: {
            show: false
        },
        visualMap: {
            min: 0,
            max: 5, // Ajusta este valor según los datos
            left: 'center',
            orient: 'horizontal',
            text: ['Casos'],
            calculable: true,
            inRange: {
                color: ['#ffffff', '#E85C0D', "#C7253E", '#821131']
            }
        },
        series: [
            {
                name: 'Femicidios',
                type: 'map',
                map: 'Salta', // El nombre registrado
                roam: false,
                emphasis: {
                    label: {
                        show: true
                    }
                },
                data: data // Los datos procesados se pasan aquí
            }
        ]
    };
}

