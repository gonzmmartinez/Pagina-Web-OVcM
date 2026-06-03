// Datos
const archivo1_2 = "../datos/json/femicidios_cantidad.json";
const archivo1_2_2 = "../datos/json/femicidios_caratulas.json"

// PROCESAMIENTO
function procesarDatos1_2(data) {
    const values1_2 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        values1_2.push(item.Cantidad);
    });

    return values1_2;
};

function procesarDatos1_2_2(data) {
    const values1_2_2 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        values1_2_2.push(item.Texto);
    });

    return values1_2_2;
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
};

// INICIALIZACIÓN
function iniciar1_2() {
    Promise.all([
        cargarDatos(archivo1_2),
        cargarDatos(archivo1_2_2)
    ])
        .then(([data1_2, data1_2_2]) => {

            const parsedData1_2 = parsearDatos(data1_2);
            const parsedData1_2_2 = parsearDatos(data1_2_2);

            const anioSeleccionado1_2 = "2026";

            const datosFiltrados1_2 = filtrarPorAnio(parsedData1_2, anioSeleccionado1_2);
            const datosFiltrados1_2_2 = filtrarPorAnio(parsedData1_2_2, anioSeleccionado1_2);

            const values1_2 = procesarDatos1_2(datosFiltrados1_2);
            const values1_2_2 = procesarDatos1_2_2(datosFiltrados1_2_2);

            document.getElementById("totalFemicidios").innerHTML = values1_2;
            document.getElementById("caratulasFemicidios").innerHTML = values1_2_2;
        })
        .catch(error => {
            console.error(error);
        });
}

// ACTUALIZAR DATOS
function actualizarGrafico1_2() {
    Promise.all([
        cargarDatos(archivo1_2),
        cargarDatos(archivo1_2_2)
    ])
        .then(([data1_2, data1_2_2]) => {

            const parsedData1_2 = parsearDatos(data1_2);
            const parsedData1_2_2 = parsearDatos(data1_2_2);

            const anioSeleccionado1_2 = document.getElementById("Anio1").value;

            const datosFiltrados1_2 = filtrarPorAnio(parsedData1_2, anioSeleccionado1_2);
            const datosFiltrados1_2_2 = filtrarPorAnio(parsedData1_2_2, anioSeleccionado1_2);

            const values1_2 = procesarDatos1_2(datosFiltrados1_2);
            const values1_2_2 = procesarDatos1_2_2(datosFiltrados1_2_2);

            document.getElementById("totalFemicidios").innerHTML = values1_2;
            document.getElementById("caratulasFemicidios").innerHTML = values1_2_2;
        })
        .catch(error => {
            document.getElementById("grafico1_2").textContent = `Error: ${error.message}`;
        });
}