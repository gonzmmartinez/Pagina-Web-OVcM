// Archivo JSON con los datos
const archivo5 = "../datos/json/femicidios_registro.json";

// Función para iniciar la tabla al cargar la página
function iniciar5() {
    let yearInicial = document.getElementById("Anio5").value;
    cargarTablaFemicidios(yearInicial);
    cargarTablaMuertes(yearInicial);
}

// Función para actualizar la tabla cuando se cambia el año
function actualizarGrafico5() {
    let yearSeleccionado = document.getElementById("Anio5").value;
    cargarTablaFemicidios(yearSeleccionado);
    cargarTablaMuertes(yearSeleccionado);
}

// Función para cargar los datos en la tabla
function cargarTablaFemicidios(year) {
    fetch(archivo5)
        .then(response => response.json())
        .then(data5 => {

            // Paso 2: Parsear los datos
            const parsedData5 = parsearDatos(data5);

            let datosFiltrados5 = filtrarFemicidiosPorAnio(parsedData5, year);

            // Destruir DataTable si ya existe (para evitar duplicados)
            if ($.fn.DataTable.isDataTable("#tablaFemicidios")) {
                $("#tablaFemicidios").DataTable().destroy();
            }

            // Poblar la tabla con los datos filtrados
            $("#tablaFemicidios").DataTable({
                data: datosFiltrados5,
                columns: [
                    { data: "Numero"},
                    { data: "Fecha_short" },
                    { data: "Iniciales" },
                    { data: "Edad" },
                    { data: "Hijos" },
                    { data: "Medio_utilizado" },
                    { data: "Vinculo" },
                    { data: "Lugar_del_hecho" },
                    { data: "Localidad" },
                    { data: "Caratula" }
                ],
                responsive: true,
                pageLength: 20,
                lengthChange: false,
                info: false,
                paging: false,
                language: {
                    "search": "Buscar:",
                    "zeroRecords":    "No se encontaron registros que coincidan.",
                }
            });
        })
        .catch(error => console.error("Error cargando los datos:", error));
}

// Función para filtrar datos por año
function filtrarFemicidiosPorAnio(data, year) {
    return data.filter(item => item.Año == year);
}