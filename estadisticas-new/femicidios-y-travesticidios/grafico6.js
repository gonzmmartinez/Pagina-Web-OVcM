// Archivo JSON con los datos
const archivo6 = "../datos/json/muertes_registro.json";

// Función para cargar los datos en la tabla
function cargarTablaMuertes(year) {
    fetch(archivo6)
        .then(response => response.json())
        .then(data6 => {

            // Paso 2: Parsear los datos
            const parsedData6 = parsearDatos(data6);

            let datosFiltrados6 = filtrarFemicidiosPorAnio(parsedData6, year);

            // Destruir DataTable si ya existe (para evitar duplicados)
            if ($.fn.DataTable.isDataTable("#tablaMuertes")) {
                $("#tablaMuertes").DataTable().destroy();
            }

            // Poblar la tabla con los datos filtrados
            $("#tablaMuertes").DataTable({
                data: datosFiltrados6,
                columns: [
                    { data: "Numero"},
                    { data: "Fecha_short" },
                    { data: "Iniciales" },
                    { data: "Edad" },
                    { data: "Hijos" },
                    { data: "Lugar_del_hecho" },
                    { data: "Localidad" },
                    { data: "Fuente" }
                ],
                responsive: true,
                pageLength: 20,
                lengthChange: false,
                info: false,
                paging: false,
                language: {
                    "search": "Buscar:",
                    "zeroRecords": "No se encontaron registros que coincidan.",
                    "emptyTable": "No hay registros en esta tabla."
                }
            });
        })
        .catch(error => console.error("Error cargando los datos:", error));
}

// Función para filtrar datos por año
function filtrarFemicidiosPorAnio(data, year) {
    return data.filter(item => item.Año == year);
}