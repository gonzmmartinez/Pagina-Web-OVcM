// Datos
const archivo4 = "../datos/json/femicidios_tasa_nacional.json";

// PROCESAMIENTO
function procesarDatos4(data) {
    return data.map(item => ({
        name: item.Provincia_corto,
        value: item.Tasa
    }));
}

// FILTRAR DATOS
function filtrarFemicidiosPorAnio(data, year) {
    return data.filter(item => item.Año === year);
  }

// Función principal para inicializar el gráfico
function iniciar4() {
    const chartDom4 = document.getElementById('grafico4');
    const myChart4 = echarts.init(chartDom4, null, {renderer: 'svg'});

    // Paso 1: Cargar los datos del archivo JSON
    cargarDatos(archivo4)
        .then(rawData4 => {
            // Paso 2: Parsear los datos
            const parsedData4 = parsearDatos(rawData4);

            // Paso 3: Filtrar o procesar los datos según la lógica específica
            const anioSeleccionado4 = "2023"; // Puedes reemplazarlo por el valor dinámico de un selector
            const datosFiltrados4 = filtrarFemicidiosPorAnio(parsedData4, anioSeleccionado4);

            const datosProcesados4 = procesarDatos4(datosFiltrados4);

            // Paso 4: Cargar el archivo GeoJSON de Argentina
            return fetch('../datos/provincias_argentina.geojson')
                .then(response => response.json())
                .then(argentinaJson => {
                    // Registrar el mapa de Argentina
                    echarts.registerMap('Argentina', { geoJSON: argentinaJson });

                    // Paso 5: Crear las opciones del gráfico
                    const option = crearGrafico4(datosProcesados4);

                    // Establecer la configuración del gráfico
                    myChart4.setOption(option);
                });
        })
        .catch(error => console.error('Error durante la inicialización del gráfico:', error));
};

// Función para actualizar el gráfico
function actualizarGrafico4() {
    const chartDom4 = document.getElementById('grafico4');
    const myChart4 = echarts.init(chartDom4, null, {renderer: 'svg'});

    cargarDatos(archivo4)
    .then(rawData4 => {
        const parsedData4 = parsearDatos(rawData4);

        const anioSeleccionado4 = document.getElementById("Anio4").value;
        const datosFiltrados4 = filtrarFemicidiosPorAnio(parsedData4, anioSeleccionado4);

        const nuevosDatosProcesados4 = procesarDatos4(datosFiltrados4);

        myChart4.setOption({
            series: [{
                data: nuevosDatosProcesados4
            }]
        })
    })
};

// Función para crear las opciones del gráfico
function crearGrafico4(data) {
    return {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}' // {b} es el nombre del departamento, {c} es el valor
        },
        toolbox: {
            show: false
        },
        visualMap: {
            min: 0,
            max: 2.5, // Ajusta este valor según los datos
            left: 'center',
            orient: 'horizontal',
            text: ['Casos'],
            calculable: true,
            inRange: {
                color: ['#ffffff', '#C68FE6', "#6C48C5", '#1230AE']
            }
        },
        series: [
            {
                name: 'Femicidios',
                type: 'map',
                map: 'Argentina', // El nombre registrado
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

