// render-graficos.js

let graficosConfig = [];

async function cargarGraficos() {
  try {
    const rutaJson = './graficosConfig.json';  // JSON en la misma carpeta que el HTML
    const resp = await fetch(rutaJson);
    if (!resp.ok) {
      throw new Error(`No se pudo cargar el archivo JSON desde ${rutaJson}: ${resp.statusText}`);
    }
    graficosConfig = await resp.json();
    renderGraficos();
  } catch (err) {
    console.error("Error cargando graficosConfig.json:", err);
  }
}

function renderGraficos() {
  const contenedorBotones = document.getElementById("indicador-container");
  const contenedorGraficos = document.getElementById("graficos-container");

  graficosConfig.forEach((grafico, index) => {
    // Crear botón
    const btn = document.createElement("button");
    btn.className = "indicadorButton" + (index === 0 ? " active" : "");
    btn.textContent = grafico.titulo;
    btn.onclick = () => showChart(grafico.id);
    contenedorBotones.appendChild(btn);

    // Crear sección
    const section = document.createElement("div");
    section.id = `chart${grafico.id}`;
    section.className = "chartContent" + (index === 0 ? " active" : "");

    section.innerHTML = `
      <div style="text-align: left;">
        <p>
          <span style="font-size:20px"><strong>${grafico.titulo}</strong></span><br>
          <span  id="subtitulo${grafico.id}" style="font-size:15px"><i>${grafico.subtitulo}</i></span>
        </p>
      </div>
      <div id="grafico${grafico.id}" style="width: 100%;"></div>
      <div style="text-align: right; font-size: 12px; color: gray">
        <p style="margin-top: 0;">
          <strong>FUENTE</strong>: ${grafico.fuente}
        </p>
      </div>
      <div style="display:flex; flex-direction: row; justify-content: space-evenly;">
        ${grafico.selects.map(sel => `
          <div class="selectContainer">
            <p>${sel.label}:</p>
            <select id="${sel.id}" onchange="${sel.onchange}">
              ${sel.opciones.map(op => `<option value="${op}">${op}</option>`).join("")}
            </select>
          </div>
        `).join("")}
      </div>
    `;

    contenedorGraficos.appendChild(section);
  });

  if (graficosConfig.length > 0) {
    actualizarFichaTecnica(graficosConfig[0].id);
  }
}

function showChart(graficoId) {
  document.querySelectorAll('.indicadorButton').forEach(btn => btn.classList.remove('active'));
  const index = graficosConfig.findIndex(g => g.id === String(graficoId));
  if (index >= 0) {
    document.querySelectorAll('.indicadorButton')[index]?.classList.add('active');
  }

  document.querySelectorAll('.chartContent').forEach(chart => chart.classList.remove('active'));
  const chartElem = document.getElementById(`chart${graficoId}`);
  if (!chartElem) {
    console.error(`No existe el elemento chart${graficoId}`);
    return;
  }
  chartElem.classList.add('active');

  if (window.activeChartInstance) {
    try { window.activeChartInstance.destroy(); } catch (e) {}
    window.activeChartInstance = null;
  }

  const iniciarFn = window[`iniciar${graficoId}`];
  if (typeof iniciarFn === "function") {
    iniciarFn().then(chartInstance => {
      window.activeChartInstance = chartInstance;
    });
  }

  actualizarFichaTecnica(String(graficoId));
}


function actualizarFichaTecnica(id) {
  const ficha = graficosConfig.find(g => g.id === String(id));
  const fichaElem = document.getElementById("fichaContenido");

  if (!ficha) {
    console.error("No se encontró ficha técnica para el ID:", id);
    return;
  }

  if (!fichaElem) {
    console.error("No se encontró el elemento #fichaContenido");
    return;
  }

  fichaElem.innerHTML = ficha.fichaHtml;
}


// FUNCIÓN SOBRE LOS GRÁFICOS
// Función para hacer el fetch
function cargarDatos(archivo) {
    return fetch(archivo) // Ruta al archivo JSON
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar JSON: ${response.status}`);
            }
            return response.json();
        });
}

// Función para parsear
function parsearDatos(data) {
    let parsedData;
    if (Array.isArray(data) && typeof data[0] === "string") {
        // Si es un array con un string JSON, realiza el segundo parseo
        parsedData = JSON.parse(data[0]);
    } else {
        // Si el JSON ya está bien estructurado, no es necesario el parseo adicional
        parsedData = data;
    }
    return parsedData;
}

document.addEventListener("DOMContentLoaded", cargarGraficos);