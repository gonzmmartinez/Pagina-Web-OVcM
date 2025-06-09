// Datos
const archivo1_2 = "../datos/json/femicidios_cantidad.json";

// PROCESAMIENTO
function procesarDatos1_2(data) {
    const values1_2 = [];

    // Procesar los datos de cada entrada
    data.forEach(item => {
        values1_2.push(item.Cantidad);            
    });

    return values1_2 ;
};

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
    return data.filter(item => item.Año === year);
};

// INICIALIZACIÓN
function iniciar1_2() {
  cargarDatos(archivo1_2) // Cargar los datos del JSON
        .then(data1_2 => {
            // Parsear los datos
            const parsedData1_2 = parsearDatos(data1_2);

            // Filtrar por el distrito seleccionado
            const anioSeleccionado1_2 = "2025";
            const datosFiltrados1_2 = filtrarPorAnio(parsedData1_2, anioSeleccionado1_2);

            // Procesar los datos filtrados
            const values1_2  = procesarDatos1_2(datosFiltrados1_2);

            document.getElementById("totalFemicidios").innerText = `${values1_2}`;
        })
        .catch(error1 => {
            document.getElementById("grafico1_8").textContent = `Error: ${error1.message}`;
        });
};

function actualizarGrafico1_2() {
  cargarDatos(archivo1_2)
      .then(data1_2 => {
          const parsedData1_2 = parsearDatos(data1_2);

          // Filtrar por el distrito seleccionado
          const anioSeleccionado1_2 = document.getElementById("Anio1").value;
          const datosFiltrados1_2 = filtrarPorAnio(parsedData1_2, anioSeleccionado1_2);

          // Procesar datos
          const values1_2 = procesarDatos1_2(datosFiltrados1_2);

          document.getElementById("totalFemicidios").innerText = `${values1_2}`;
      })
      .catch(error => {
          document.getElementById("grafico1_2").textContent = `Error: ${error.message}`;
      });
}