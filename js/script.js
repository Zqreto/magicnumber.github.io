var numeroSecreto      = generarNumero(); // Número aleatorio entre 1 y 100
var intentoActual      = 1;               // Contador de intentos
var intentosAnteriores = [];              // Historial de números ingresados
var MAX_INTENTOS       = 10;              // Máximo de balas de cañón

// Crea las bablas de cañon
function iniciarBalas() {
  var contenedor = document.getElementById("balas");
  contenedor.innerHTML = "";
  for (var i = 1; i <= MAX_INTENTOS; i++) {
    var bala = document.createElement("div");
    bala.className = "bala";
    bala.id = "bala-" + i;
    contenedor.appendChild(bala);
  }
}


// Genera un número aleatorio entre 1 y 100
function generarNumero() {
  return Math.floor(Math.random() * 100) + 1;
}

// LÓGICA PRINCIPAL DEL JUEGO
function adivinar() {
  var input  = document.getElementById("input-numero");
  var numero = parseInt(input.value);

  // Validación de entrada
  if (isNaN(numero) || numero < 1 || numero > 100) {
    mostrarMensaje("⚠️", "¡Marinero! Ingresa un número entre 1 y 100.", "mal");
    sacudir();
    return;
  }

  intentosAnteriores.push(numero);

  // --- Victoria ---
  if (numero === numeroSecreto) {
    marcarBala(intentoActual, "correcta");
    agregarChip(numero, "ok");
    mostrarMensaje("🏆", "¡Encontraste el número del Rey Pirata!", "bien");
    setTimeout(function() { mostrarModalGanar(intentoActual); }, 450);
    bloquearJuego();

  // --- Último intento fallido ---
  } else if (intentoActual >= MAX_INTENTOS) {
    marcarBala(intentoActual, "usada");
    agregarChip(numero, numero < numeroSecreto ? "mayor" : "menor");
    mostrarMensaje("💀", "¡Sin balas! El mar te venció...", "mal");
    setTimeout(function() { mostrarModalPerder(); }, 450);
    bloquearJuego();

  // --- El número secreto es MAYOR ---
  } else if (numero < numeroSecreto) {
    marcarBala(intentoActual, "usada");
    agregarChip(numero, "mayor");
    mostrarMensaje("🌊", "¡El número es MAYOR que " + numero + "! Intento " + intentoActual + " de " + MAX_INTENTOS + ".", "mayor");
    sacudir();
    intentoActual++;

  // --- El número secreto es MENOR ---
  } else if (numero > numeroSecreto) {
    marcarBala(intentoActual, "usada");
    agregarChip(numero, "menor");
    mostrarMensaje("🐠", "¡El número es MENOR que " + numero + "! Intento " + intentoActual + " de " + MAX_INTENTOS + ".", "menor");
    sacudir();
    intentoActual++;
  }

  input.value = "";
  input.focus();
}

// Actualiza el mensaje de pista con ícono y estilo
function mostrarMensaje(icono, texto, tipo) {
  var box     = document.getElementById("mensaje-box");
  var iconoEl = document.getElementById("icono-msg");
  var textoEl = document.getElementById("texto-msg");

  iconoEl.textContent = icono;
  textoEl.textContent = texto;
  box.className = "mensaje-box " + tipo;
}

// Animación de sacudida en la caja de mensaje
function sacudir() {
  var box = document.getElementById("mensaje-box");
  box.classList.remove("sacudir");
  void box.offsetWidth;
  box.classList.add("sacudir");
}

// Cambia el estado visual de una bala de cañón
function marcarBala(numero, estado) {
  var bala = document.getElementById("bala-" + numero);
  if (bala) bala.classList.add(estado);
}

// Agrega un chip al historial de intentos
function agregarChip(numero, tipo) {
  var chips = document.getElementById("chips");

  // Elimina el texto vacío si existe
  var vacio = chips.querySelector(".vacio");
  if (vacio) vacio.remove();

  var chip = document.createElement("span");
  chip.className = "chip " + tipo;

  // Flecha según si era mayor ↑, menor ↓ o correcto ✓
  var flecha = tipo === "mayor" ? " ↑" : tipo === "menor" ? " ↓" : " ✓";
  chip.textContent = numero + flecha;

  chips.appendChild(chip);
}

// Deshabilita la entrada al terminar el juego
function bloquearJuego() {
  document.getElementById("input-numero").disabled = true;
  document.getElementById("btn-adivinar").disabled = true;
}


// Muestra el modal de victoria con Luffy y confeti
function mostrarModalGanar(intentos) {
  var overlay = document.getElementById("overlay-ganar");
  document.getElementById("msg-ganar").textContent =
    "¡Encontraste el número " + numeroSecreto + " en " + intentos + " intento" + (intentos > 1 ? "s" : "") + "! ¡Eres digno del sombrero de paja!";

  // Reinicia la animación de Luffy
  var luffyImg = document.getElementById("luffy-img");
  luffyImg.style.animation = "none";
  void luffyImg.offsetWidth;
  luffyImg.style.animation = "";

  // Reproduce el audio de victoria
  var audioVictoria = document.getElementById("audio-victoria");
  audioVictoria.currentTime = 0;
  audioVictoria.play().catch(function() {});

  generarConfeti();
  overlay.classList.add("activo");
}

// Muestra el modal de derrota aparece Barba Negra con su risa
function mostrarModalPerder() {
  var overlay = document.getElementById("overlay-perder");
  document.getElementById("msg-perder").textContent =
    "Usaste tus " + MAX_INTENTOS + " balas de cañón. El número era el " + numeroSecreto + ". ¡Zehahahaha! ¡Barba Negra te venció!";

  // Reinicia la animación de Barba Negra quitando y volviendo a poner la imagen
  var bbImg = document.getElementById("bb-img");
  bbImg.style.animation = "none";
  void bbImg.offsetWidth; // Fuerza reflow
  bbImg.style.animation = "";

  // Reproduce el audio de la risa de Barba Negra
  var audio = document.getElementById("audio-bb");
  audio.currentTime = 0;
  audio.play().catch(function() {
    // Si el navegador bloquea el audio, no pasa nada
    console.log("Audio bloqueado por el navegador.");
  });

  overlay.classList.add("activo");
}

// Genera confeti
function generarConfeti() {
  var cont   = document.getElementById("confeti");
  var colores = ["#f5c518", "#c8960a", "#c0392b", "#0d3b6e", "#f9edd8", "#fff"];
  cont.innerHTML = "";

  for (var i = 0; i < 45; i++) {
    var p = document.createElement("div");
    p.className = "pieza-confeti";
    p.style.left             = Math.random() * 100 + "%";
    p.style.background       = colores[Math.floor(Math.random() * colores.length)];
    p.style.width            = (6 + Math.random() * 8) + "px";
    p.style.height           = (6 + Math.random() * 8) + "px";
    p.style.animationDuration = (1.5 + Math.random() * 2.5) + "s";
    p.style.animationDelay   = (Math.random() * 1) + "s";
    p.style.borderRadius     = Math.random() > 0.5 ? "50%" : "2px";
    cont.appendChild(p);
  }
}


// Reinicia el juego
function reiniciar() {
  // Oculta los modales
  document.getElementById("overlay-ganar").classList.remove("activo");
  document.getElementById("overlay-perder").classList.remove("activo");

  // Detiene los audios al reiniciar
  var audio = document.getElementById("audio-bb");
  audio.pause();
  audio.currentTime = 0;

  var audioVictoria = document.getElementById("audio-victoria");
  audioVictoria.pause();
  audioVictoria.currentTime = 0;

  // Reinicia variables
  numeroSecreto      = generarNumero();
  intentoActual      = 1;
  intentosAnteriores = [];

  // Reactiva controles
  document.getElementById("input-numero").disabled = false;
  document.getElementById("input-numero").value    = "";
  document.getElementById("btn-adivinar").disabled = false;

  // Limpia historial y mensaje
  document.getElementById("chips").innerHTML = '<span class="vacio">Sin registros aún...</span>';
  mostrarMensaje("🗺️", "¡Adivina el número mágico, marinero!", "");

  // Redibuja balas
  iniciarBalas();

  document.getElementById("input-numero").focus();
}


// Enviar con Enter
document.getElementById("input-numero").addEventListener("keypress", function(e) {
  if (e.key === "Enter") adivinar();
});

// Los modales solo se cierran con el botón, no al hacer clic en el fondo


// Arranque
iniciarBalas();
