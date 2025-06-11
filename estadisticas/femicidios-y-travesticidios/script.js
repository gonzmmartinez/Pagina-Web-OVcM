// Datos
const archivo1 = "../datos/json/femicidios_causas_judiciales.json";

// FUNCION PARA INICIALIZAR TODOS LOS OTROS GRAFICOS
function iniciar1() {
  iniciar1_2();
  iniciar1_3();
  iniciar1_4();
  iniciar1_5();
  iniciar1_6();
  iniciar1_7();
  iniciar1_8();

  procesarCausas();
}

// FUNCION PARA ACTUALIZAR TODOS LOS GRAFICOS
function actualizarGraficos() {
  actualizarGrafico1_2();  
  actualizarGrafico1_3();
  actualizarGrafico1_4();
  actualizarGrafico1_5();
  actualizarGrafico1_6();
  actualizarGrafico1_7();
  actualizarGrafico1_8();

  procesarCausas();
}

// FILTRAR DATOS
function filtrarPorAnio(data, year) {
  return data.filter(item => item.Año === year);
}

// Función para procesar las causas judiciales
function procesarCausas() {
  cargarDatos(archivo1)
    .then(dataCJ => {
      const datosParseados = parsearDatos(dataCJ);

      // Filtrar por el año seleccionado
      const anioSeleccionado = document.getElementById("Anio1").value;
      const datosFiltrados = filtrarPorAnio(datosParseados, anioSeleccionado);

      // Obtener las cantidades de "Total" y "No"
      const mujeresTotalCJ = datosFiltrados.find(item => item.Causa === "Total")?.Cantidad || 0;
      const mujeresNoCJ = datosFiltrados.find(item => item.Causa === "No")?.Cantidad || 0;

      // ICONOS MUJERES CAUSAS
      const X = mujeresTotalCJ; // Número total de íconos
      const Y = mujeresNoCJ;  // Número de íconos pintados
      const iconPath = './svg/mujeresIcon.svg'; // Ruta al archivo SVG

      // Obtener el contenedor de íconos
      const iconContainer = document.getElementById('mujeresIconos');

      // **Vaciar el contenedor antes de añadir nuevos íconos**
      iconContainer.innerHTML = '';

      // Generar los íconos dinámicamente
      for (let i = 0; i < X; i++) {
        const imgElement = document.createElement('img');
        imgElement.src = iconPath;
        imgElement.classList.add('mujeres-icon');

        // Añadir la clase 'filled' a los primeros Y íconos
        if (i < Y) {
          imgElement.classList.add('filled');
        }

        // Añadir el ícono al contenedor
        iconContainer.appendChild(imgElement);
      };

      // **Actualizar el texto en el contenedor "causasJudiciales"**
      const causasContainer = document.getElementById('causasJudiciales');
      causasContainer.innerHTML = `
        <strong>Son ${Y} los casos que no tienen causa judicial</strong><br>
        por la muerte posterior al hecho del presunto femicida
      `;

    })
    .catch(error => {
      console.error("Error procesando causas:", error);
    });
}


// Función para recortar texto
function cortarTexto(texto, limite) {
    const palabras = texto.toString().split(" ");
    const resultado = []; // Aquí almacenaremos las líneas
    let lineaActual = "";
  
    palabras.forEach(palabra => {
      if ((lineaActual + " " + palabra).trim().length > limite) {
        resultado.push(lineaActual.trim()); // Agrega la línea actual al array
        lineaActual = palabra; // Inicia una nueva línea
      } else {
        lineaActual += " " + palabra; // Continúa con la línea actual
      }
    });
  
    // Agregar la última línea si quedó algo
    if (lineaActual) {
      resultado.push(lineaActual.trim());
    }

    return resultado;
  }
  
  // 8. Llamar la función principal al cargar la página
window.addEventListener("load", iniciar1);