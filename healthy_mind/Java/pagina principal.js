const nav = document.querySelector("#barra");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");
const logo = document.querySelector("#logo");
const mainContent = document.querySelector("main");

abrir.addEventListener("click", () => {
    nav.classList.add("visible")
    logo.style.display = "none";
    mainContent.style.display = "none";
})

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible")
    logo.style.display = "block";
    mainContent.style.display = "block";
})

document.querySelectorAll(".barralista li a").forEach(enlace => {
    enlace.addEventListener("click", (e) => {
        const icono = enlace.querySelector("i"); // Selecciona el icono dentro del enlace
        if (icono) {
            icono.classList.add("animacion");

            // Eliminar la animación después de que termine
            setTimeout(() => {
                icono.classList.remove("animacion");
            }, 300);
        }
    });
});

const commentBoxes = document.querySelectorAll(".caja_comentarios");

abrir.addEventListener("click", () => {
    commentBoxes.forEach(comment => comment.style.display = "none");
});

cerrar.addEventListener("click", () => {
    commentBoxes.forEach(comment => comment.style.display = "block");
});

// Variable global para almacenar el usuario autenticado
let currentUser = null;
// Variable global para el timeout de verificación
let verificacionTimeout = null;

/* ============================
   Funciones de Validación
   ============================ */
function contieneURL(texto) {
  const patronURL = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
  return patronURL.test(texto);
}

function contieneNumeros(texto) {
  const patronNumeros = /\d/;
  return patronNumeros.test(texto);
}

function validarTexto(texto) {
  if (contieneURL(texto)) {
    mostrarVentanaEmergente("⚠️ Por seguridad, no se permiten URLs en los comentarios o respuestas.");
    return false;
  }
  if (contieneNumeros(texto)) {
    mostrarVentanaEmergente("⚠️ No se permiten números en los comentarios o respuestas.");
    return false;
  }
  return true;
}

/* ============================
   Verificación de Comentarios con GEMINI API
   ============================ */
async function verificarComentario(texto) {
  const btnPublicar = document.getElementById('btnPublicar');
  const statusIndicator = document.getElementById('statusIndicator');
  const statusIcon = document.getElementById('statusIcon');
  const statusText = document.getElementById('statusText');
       
  // Si el texto está vacío, deshabilitar el botón y ocultar el indicador
  if (!texto.trim()) {
    btnPublicar.disabled = true;
    statusIndicator.classList.add('hidden');
    statusText.textContent = '';
    statusIcon.textContent = '';
    return;
  }
       
  // Limpiamos cualquier timeout previo para evitar verificaciones múltiples
  clearTimeout(verificacionTimeout);
       
  // Esperamos 500ms para verificar (evita llamadas a la API en cada tecla)
  verificacionTimeout = setTimeout(async () => {
    // Mostrar indicador de carga
    statusIndicator.classList.remove('hidden');
    statusIndicator.className = 'status-indicator status-loading';
    statusIcon.textContent = '⏳';
    statusText.innerHTML = '<span class="loader"></span>Verificando contenido...';
           
    try {
      const response = await fetch('http://localhost:5000/moderar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido: texto })
      });
               
      const resultado = await response.json();
               
      // Actualizar UI según el resultado
      if (resultado.clasificacion === 'aprobado') {
        btnPublicar.disabled = false;
        statusIndicator.className = 'status-indicator status-approved';
        statusIcon.textContent = '✅';
        statusText.textContent = 'Contenido apropiado. Puedes publicar tu comentario.';
      } else {
        btnPublicar.disabled = true;
        statusIndicator.className = 'status-indicator status-rejected';
        statusIcon.textContent = '❌';
        statusText.textContent = `Contenido inapropiado: ${resultado.explicacion}`;
      }
    } catch (error) {
      console.error('Error al verificar contenido:', error);
      statusIndicator.className = 'status-indicator status-rejected';
      statusIcon.textContent = '⚠️';
      statusText.textContent = 'Error al verificar el contenido. Inténtalo de nuevo.';
      btnPublicar.disabled = true;
    }
  }, 500);
}

/* ============================
   Formato de Tiempo
   ============================ */
function obtenerHoraFormateada() {
  const ahora = new Date();
  const horas = ahora.getHours().toString().padStart(2, '0');
  const minutos = ahora.getMinutes().toString().padStart(2, '0');
  return `${horas}:${minutos}`;
}

/* ============================
   Ventana Emergente
   ============================ */
function mostrarVentanaEmergente(mensaje) {
  document.querySelectorAll('.fondo-modal').forEach(el => el.remove());

  const fondoModal = document.createElement('div');
  fondoModal.classList.add('fondo-modal');

  const modal = document.createElement('div');
  modal.classList.add('modal');

  const mensajeP = document.createElement('p');
  mensajeP.textContent = mensaje;

  const botonCerrar = document.createElement('button');
  botonCerrar.textContent = 'Cerrar';
  botonCerrar.classList.add('boton-cerrar');
  botonCerrar.onclick = () => fondoModal.remove();

  modal.appendChild(mensajeP);
  modal.appendChild(botonCerrar);
  fondoModal.appendChild(modal);
  document.body.appendChild(fondoModal);
}

/* ============================
   Sesión de Usuario
   ============================ */
function iniciarSesion() {
  const usernameInput = document.getElementById("username");
  const username = usernameInput.value.trim();

  if (username === "") {
    mostrarVentanaEmergente("Por favor, ingresa un nombre de usuario.");
    return;
  }

  currentUser = username;
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("comentariosSection").style.display = "block";
}

function toggleLoginModal() {
  const modal = document.getElementById("loginSection");
  modal.style.display = modal.style.display === "none" ? "block" : "none";
}

/* ============================
   Creación de Comentarios
   ============================ */
// Modifica la función crearElementoEntrada para añadir verificación a las respuestas
function crearElementoEntrada(texto, tipo) {
  const contenedor = document.createElement("div");
  contenedor.classList.add(tipo);

  const cabeceraDiv = document.createElement("div");
  cabeceraDiv.classList.add("cabecera-entrada");

  const usuarioSpan = document.createElement("span");
  usuarioSpan.classList.add("nombre-usuario");
  usuarioSpan.textContent = currentUser || "Anónimo";
  cabeceraDiv.appendChild(usuarioSpan);

  // Agregar hora de publicación
  const horaSpan = document.createElement("span");
  horaSpan.classList.add("tiempo-publicacion");
  horaSpan.textContent = obtenerHoraFormateada();
  cabeceraDiv.appendChild(horaSpan);

  contenedor.appendChild(cabeceraDiv);

  const textoP = document.createElement("p");
  textoP.innerHTML = texto;
  contenedor.appendChild(textoP);

  const reaccionesDiv = document.createElement("div");
  reaccionesDiv.classList.add("reacciones");
  const reacciones = { "❤️": 0, "😂": 0, "😮": 0, "😢": 0 };
  let seleccionado = null;

  Object.keys(reacciones).forEach(emoji => {
    const span = document.createElement("span");
    span.classList.add("reaccion");
    span.dataset.emoji = emoji;
    span.innerHTML = `${emoji} <span class="like-contador">0</span>`;

    span.onclick = () => {
      if (seleccionado === emoji) {
        reacciones[emoji] = 0;
        seleccionado = null;
        span.querySelector(".like-contador").textContent = 0;
        return;
      }
      if (seleccionado) {
        reacciones[seleccionado] = 0;
        const prev = reaccionesDiv.querySelector(`span[data-emoji="${seleccionado}"] .like-contador`);
        prev.textContent = 0;
      }
      reacciones[emoji] = 1;
      seleccionado = emoji;
      span.querySelector(".like-contador").textContent = 1;
    };

    reaccionesDiv.appendChild(span);
  });

  contenedor.appendChild(reaccionesDiv);

  const inputRespuesta = document.createElement("input");
  inputRespuesta.type = "text";
  inputRespuesta.placeholder = "Escribe una respuesta...";
  inputRespuesta.classList.add("input-respuesta");

  // Crear un contenedor para el estado de la respuesta
  const respuestaStatusIndicator = document.createElement('div');
  respuestaStatusIndicator.className = 'status-indicator hidden';
  
  const respuestaStatusIcon = document.createElement('span');
  respuestaStatusIcon.className = 'status-icon';
  
  const respuestaStatusText = document.createElement('span');
  respuestaStatusText.className = 'status-text';
  
  respuestaStatusIndicator.appendChild(respuestaStatusIcon);
  respuestaStatusIndicator.appendChild(respuestaStatusText);

  const botonRespuesta = document.createElement("button");
  botonRespuesta.textContent = "Responder";
  botonRespuesta.classList.add("boton-responder");
  botonRespuesta.disabled = true; // Deshabilitar por defecto hasta que pase verificación

  const contenedorRespuestas = document.createElement("div");
  contenedorRespuestas.classList.add("respuestas");

  const toggleRespuestasBtn = document.createElement("span");
  toggleRespuestasBtn.innerHTML = "&#9654;";
  toggleRespuestasBtn.classList.add("toggle-respuestas");
  toggleRespuestasBtn.title = "Mostrar/Ocultar respuestas";
  toggleRespuestasBtn.style.cursor = "pointer";
  contenedorRespuestas.style.display = "none";

  toggleRespuestasBtn.onclick = () => {
    const visible = contenedorRespuestas.style.display === "block";
    contenedorRespuestas.style.display = visible ? "none" : "block";
    toggleRespuestasBtn.innerHTML = visible ? "&#9654;" : "&#9660;";
  };

  contenedor.appendChild(toggleRespuestasBtn);
  
  // Añadir el evento de input para verificar la respuesta mientras se escribe
  inputRespuesta.addEventListener('input', function() {
    verificarRespuesta(this.value, botonRespuesta, respuestaStatusIndicator, respuestaStatusIcon, respuestaStatusText);
  });

  botonRespuesta.onclick = () => {
    const resp = inputRespuesta.value.trim();
    if (resp) {
      if (!currentUser) {
        mostrarVentanaEmergente("Debes iniciar sesión para responder.");
        return;
      }
      const nueva = crearElementoEntrada(resp, "respuesta");
      contenedorRespuestas.appendChild(nueva);
      inputRespuesta.value = "";
      
      // Reiniciar el estado de verificación
      botonRespuesta.disabled = true;
      respuestaStatusIndicator.classList.add('hidden');
    }
  };

  contenedor.appendChild(inputRespuesta);
  contenedor.appendChild(respuestaStatusIndicator); // Añadir el indicador de estado
  contenedor.appendChild(botonRespuesta);
  contenedor.appendChild(contenedorRespuestas);

  return contenedor;
}

// Nueva función para verificar respuestas (similar a verificarComentario pero específica para respuestas)
async function verificarRespuesta(texto, boton, indicador, icono, textoIndicador) {
  // Si el texto está vacío, deshabilitar el botón y ocultar el indicador
  if (!texto.trim()) {
    boton.disabled = true;
    indicador.classList.add('hidden');
    textoIndicador.textContent = ' ';
    icono.textContent = ' ';
    return;
  }
  
  // Limpiamos cualquier timeout previo para evitar verificaciones múltiples
  clearTimeout(verificacionTimeout);
  
  // Esperamos 500ms para verificar (evita llamadas a la API en cada tecla)
  verificacionTimeout = setTimeout(async () => {
    // Primera verificación básica
    if (!validarTexto(texto)) {
      boton.disabled = true;
      return;
    }
    
    // Mostrar indicador de carga
    indicador.classList.remove('hidden');
    indicador.className = 'status-indicator status-loading';
    icono.textContent = '⏳';
    textoIndicador.innerHTML = '<span class="loader"></span>Verificando contenido...';
      
    try {
      const response = await fetch('http://localhost:5000/moderar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido: texto })
      });
          
      const resultado = await response.json();
          
      // Actualizar UI según el resultado
      if (resultado.clasificacion === 'aprobado') {
        boton.disabled = false;
        indicador.className = 'status-indicator status-approved';
        icono.textContent = '✅';
        textoIndicador.textContent = 'Contenido apropiado. Puedes publicar tu respuesta.';
      } else {
        boton.disabled = true;
        indicador.className = 'status-indicator status-rejected';
        icono.textContent = '❌';
        textoIndicador.textContent = `Contenido inapropiado: ${resultado.explicacion}`;
      }
    } catch (error) {
      console.error('Error al verificar contenido:', error);
      indicador.className = 'status-indicator status-rejected';
      icono.textContent = '⚠️';
      textoIndicador.textContent = 'Error al verificar el contenido. Inténtalo de nuevo.';
      boton.disabled = true;
    }
  }, 500);
}

/* ============================
   Últimos Posts
   ============================ */
const todosLosPosts = [];

function actualizarUltimosPosts() {
  const contenedor = document.getElementById("ultimosPostsContainer");
  contenedor.innerHTML = "";

  const ultimos = todosLosPosts.slice(-3).reverse();

  ultimos.forEach(post => {
    const postElement = document.createElement("div");
    postElement.className = "post";

    const header = document.createElement("div");
    header.className = "post-header";

    const avatar = document.createElement("div");
    avatar.className = "avatar";

    const nombre = document.createElement("span");
    nombre.className = "nombre";
    nombre.textContent = post.usuario;

    // Agregar hora al post
    const hora = document.createElement("span");
    hora.className = "tiempo-publicacion";
    hora.textContent = post.hora || obtenerHoraFormateada();

    header.appendChild(avatar);
    header.appendChild(nombre);
    header.appendChild(hora);

    const texto = document.createElement("p");
    texto.textContent = post.texto;

    const boton = document.createElement("button");
    boton.className = "ver-mas";
    boton.textContent = "Ver más";
    boton.onclick = function () {
      const fondoModal = document.createElement('div');
      fondoModal.classList.add('fondo-modal');

      const modal = document.createElement('div');
      modal.classList.add('modal');

      const modalNombre = document.createElement('h3');
      modalNombre.textContent = post.usuario;
      
      const modalHora = document.createElement('span');
      modalHora.className = "tiempo-publicacion";
      modalHora.textContent = post.hora || obtenerHoraFormateada();
      
      const modalTexto = document.createElement('p');
      modalTexto.textContent = post.texto;

      const botonCerrar = document.createElement('button');
      botonCerrar.textContent = "Cerrar";
      botonCerrar.className = "boton-cerrar";
      botonCerrar.onclick = function () {
        fondoModal.remove();
      };

      modal.appendChild(modalNombre);
      modal.appendChild(modalHora);
      modal.appendChild(modalTexto);
      modal.appendChild(botonCerrar);

      fondoModal.appendChild(modal);
      document.body.appendChild(fondoModal);
    };

    postElement.appendChild(header);
    postElement.appendChild(texto);
    postElement.appendChild(boton);
    contenedor.appendChild(postElement);
  });
}

/* ============================
   Publicar Comentario
   ============================ */
   function publicarComentario() {
    const texto = document.getElementById("comentario").value.trim();
  
    if (!currentUser) {
      mostrarVentanaEmergente("Debes iniciar sesión para comentar.");
      return;
    }
  
    if (!texto || !validarTexto(texto)) return;
  
    const nuevo = crearElementoEntrada(texto, "comentario");
    document.getElementById("lista_comentarios").prepend(nuevo);
    document.getElementById("comentario").value = "";
    
    // Ocultar el indicador de estado después de publicar
    const statusIndicator = document.getElementById('statusIndicator');
    if (statusIndicator) {
      statusIndicator.classList.add('hidden');
      document.getElementById('statusIcon').textContent = '';
      document.getElementById('statusText').textContent = '';
    }
    
    // Desactivar el botón hasta que se escriba un nuevo comentario
    const btnPublicar = document.getElementById('btnPublicar');
    if (btnPublicar) {
      btnPublicar.disabled = true;
    }
  
    const hora = obtenerHoraFormateada();
    todosLosPosts.push({ usuario: currentUser, texto, hora });
    actualizarUltimosPosts();
  }

/* ============================
   Inicialización
   ============================ */
document.addEventListener('DOMContentLoaded', function () {
  // Agregar el componente de verificación al formulario de comentarios
  const cajaComentarios = document.querySelector(".caja_comentarios");
  if (cajaComentarios) {
    // Crear el indicador de estado
    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'statusIndicator';
    statusIndicator.className = 'status-indicator hidden';
    
    const statusIcon = document.createElement('span');
    statusIcon.id = 'statusIcon';
    statusIcon.className = 'status-icon';
    
    const statusText = document.createElement('span');
    statusText.id = 'statusText';
    statusText.className = 'status-text';
    
    statusIndicator.appendChild(statusIcon);
    statusIndicator.appendChild(statusText);
    
    // Insertar el indicador después del textarea
    const textarea = document.getElementById('comentario');
    if (textarea) {
      textarea.parentNode.insertBefore(statusIndicator, textarea.nextSibling);
      
      // Cambiar el botón existente para tener ID
      const oldButton = document.querySelector(".caja_comentarios > button");
      if (oldButton) {
        oldButton.id = 'btnPublicar';
        oldButton.disabled = true;
      }
      
      // Añadir evento de entrada para activar la verificación
      textarea.addEventListener('input', function() {
        verificarComentario(this.value);
      });
    }
  }

  const botonPublicar = document.querySelector(".caja_comentarios > button");
  if (botonPublicar) {
    const clon = botonPublicar.cloneNode(true);
    clon.id = 'btnPublicar';
    botonPublicar.parentNode.replaceChild(clon, botonPublicar);
    clon.addEventListener("click", publicarComentario);
  }

  const titulo = document.querySelector(".post-amigos h3");
  if (titulo) titulo.textContent = "Últimos posts";
  
  // Asegurar que la sección de comentarios esté oculta al inicio si no hay usuario
  if (!currentUser) {
    const comentariosSection = document.getElementById("comentariosSection");
    if (comentariosSection) {
      comentariosSection.style.display = "none";
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const themeStatus = document.getElementById("theme-status");
  const toggleThemeBtn = document.getElementById("toggle-theme");

  function toggleDarkMode() {
      body.classList.toggle("dark-mode");
      const isDarkMode = body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");

      if (themeStatus) {
          themeStatus.textContent = isDarkMode ? "Oscuro" : "Claro";
      }
  }

  if (localStorage.getItem("theme") === "dark") {
      body.classList.add("dark-mode");
      if (themeStatus) {
          themeStatus.textContent = "Oscuro";
      }
  } else {
      if (themeStatus) {
          themeStatus.textContent = "Claro";
      }
  }

  if (toggleThemeBtn) {
      toggleThemeBtn.addEventListener("click", toggleDarkMode);
  }
});
// Modal para seleccionar avatar
document.addEventListener("DOMContentLoaded", function () {
const modalAvatar = document.getElementById("modalAvatar");
const btnAbrirModal = document.getElementById("abrirModalAvatar");
const btnCerrarModal = document.getElementById("cerrarModalAvatar");
const avatarOpciones = document.querySelectorAll(".avatar-img");
const avatarSeleccionado = document.getElementById("avatarSeleccionado");

// Cargar avatar desde localStorage si existe
const avatarGuardado = localStorage.getItem("avatarSeleccionado");
if (avatarGuardado) {
    avatarSeleccionado.src = avatarGuardado;
}

// Abrir modal
btnAbrirModal.addEventListener("click", function (e) {
    e.preventDefault();
    modalAvatar.style.display = "block";
});

// Cerrar modal
btnCerrarModal.addEventListener("click", function () {
    modalAvatar.style.display = "none";
});

// Seleccionar avatar
avatarOpciones.forEach(avatar => {
    avatar.addEventListener("click", function () {
        const nuevaSrc = this.src;
        avatarSeleccionado.src = nuevaSrc;
        localStorage.setItem("avatarSeleccionado", nuevaSrc);
        modalAvatar.style.display = "none";
    });
});

// Cerrar modal al hacer clic fuera
window.addEventListener("click", function (e) {
    if (e.target === modalAvatar) {
        modalAvatar.style.display = "none";
    }
});
});

