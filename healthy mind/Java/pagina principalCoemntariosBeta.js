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

function moveCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    const wrapper = carousel.querySelector('.carousel-wrapper');
    const items = wrapper.children;
    const totalItems = items.length;

    let currentIndex = parseInt(wrapper.getAttribute('data-index')) || 0;
    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = totalItems - 1;
    } else if (currentIndex >= totalItems) {
        currentIndex = 0;
    }

    wrapper.style.transform = `translateX(-${currentIndex * 100}%)`; 
    wrapper.setAttribute('data-index', currentIndex);
}

document.addEventListener("DOMContentLoaded", function () {
    const carousels = document.querySelectorAll(".contenido_carrusel");

    carousels.forEach(carousel => {
        const wrapper = carousel.querySelector(".carousel-wrapper");

        let startX = 0;
        let endX = 0;

        // Guardar la posición inicial del toque
        wrapper.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
        });

        // Guardar la posición final del toque y decidir el movimiento
        wrapper.addEventListener("touchend", (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe(carousel.id);
        });

        function handleSwipe(carouselId) {
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                moveCarousel(carouselId, diff > 0 ? 1 : -1);
            }
        }
    });
});

function toggleArrows() {
    const isMobile = window.innerWidth <= 600;
    document.querySelectorAll(".flechas_carrusel").forEach(arrow => {
        arrow.style.display = isMobile ? "none" : "block";
    });
}

window.addEventListener("load", toggleArrows);
window.addEventListener("resize", toggleArrows);

function handleClick(element) {
    document.querySelectorAll('.inferiores_item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');
}

const carousels = document.querySelectorAll(".contenido_carrusel");

abrir.addEventListener("click", () => {
    nav.classList.add("visible");
    logo.style.display = "none";
    carousels.forEach(carousel => {
        carousel.classList.add("hidden");
    });
});

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
    logo.style.display = "block";
    carousels.forEach(carousel => {
        carousel.classList.remove("hidden");
    });
});

const commentBoxes = document.querySelectorAll(".caja_comentarios");

abrir.addEventListener("click", () => {
    commentBoxes.forEach(comment => comment.style.display = "none");
});

cerrar.addEventListener("click", () => {
    commentBoxes.forEach(comment => comment.style.display = "block");
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

// Variable global para almacenar el usuario autenticado
let currentUser = null;

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

  const botonRespuesta = document.createElement("button");
  botonRespuesta.textContent = "Responder";
  botonRespuesta.classList.add("boton-responder");

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

  botonRespuesta.onclick = () => {
    const resp = inputRespuesta.value.trim();
    if (resp && validarTexto(resp)) {
      if (!currentUser) {
        mostrarVentanaEmergente("Debes iniciar sesión para responder.");
        return;
      }
      const nueva = crearElementoEntrada(resp, "respuesta");
      contenedorRespuestas.appendChild(nueva);
      inputRespuesta.value = "";
    }
  };

  contenedor.appendChild(inputRespuesta);
  contenedor.appendChild(botonRespuesta);
  contenedor.appendChild(contenedorRespuestas);

  return contenedor;
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

  const hora = obtenerHoraFormateada();
  todosLosPosts.push({ usuario: currentUser, texto, hora });
  actualizarUltimosPosts();
}

/* ============================
   Inicialización
   ============================ */
document.addEventListener('DOMContentLoaded', function () {
  const botonPublicar = document.querySelector(".caja_comentarios > button");
  if (botonPublicar) {
    const clon = botonPublicar.cloneNode(true);
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