const data = [
  {
    id: 'p01',
    title: 'Montaña',
    desc: 'Rocas y niebla',
    src: 'https://picsum.photos/id/1018/1200/675',
  },
  {
    id: 'p02',
    title: 'Mar',
    desc: 'Horizonte y calma',
    src: 'https://picsum.photos/id/1015/1200/675',
  },
  {
    id: 'p03',
    title: 'Rio',
    desc: 'Tranquilidad',
    src: 'https://picsum.photos/id/1011/1200/675',
  },
  {
    id: 'p04',
    title: 'Bosque',
    desc: 'Alaska salvaje',
    src: 'https://picsum.photos/id/1020/1200/675',
  },
  {
    id: 'p05',
    title: 'Canon',
    desc: 'Desierto rojizo',
    src: 'https://picsum.photos/id/1016/1200/675',
  },
  {
    id: 'p06',
    title: 'Ruta',
    desc: 'Camino en perspectiva',
    src: 'https://picsum.photos/id/1005/1200/675',
  },
];

// Recuperando elementos del DOM
const frame = document.querySelector('.frame');
const thumbs = document.querySelector('#thumbs'); // Miniatura
const heroImg = document.querySelector('#heroImg'); // Imagen Principal
const heroTitle = document.querySelector('#heroTitle'); // Titulo de la imagen
const heroDesc = document.querySelector('#heroDesc'); // Description de la Imagen
const counter = document.querySelector('#counter'); // Contador de Imágenes
const likeBtn = document.querySelector('#likeBtn'); // Botón de "Me Gusta"

const prevBtn = document.querySelector('#prevBtn'); // Botón de "anterior"
const nextBtn = document.querySelector('#nextBtn'); // Botón de "siguiente"
const playBtn = document.querySelector('#playBtn'); // Botón de "reproducir"

// Trabajar con el estado de la aplicación
let currentIndex = 0; // Indice de la imagen actual
const likes = {}; // Objeto para almacenar los "Me Gusta" por imagen

let autoPlayId = null; // Variable para almacenar el ID del intervalo de autoplay
let isPlaying = false; // Estado de reproducción automática
const AUTO_TIME = 1500; // Tiempos entre cambios automáticos (1.5 segundos)

// dots y tracks no existen en el DOM actual
// Se intentan buscar, pero si no están se crearan
// Usando JS
let dots = document.querySelector('#dots');
let track = document.querySelector('.track');

// Variables para detectar swipe (deslizamiento)
let startX = 0;
let currentX = 0;
let isDragging = false;
let moved = false;

// Distancia minima para considerar un swipe
const SWIPE_THRESHOLD = 50;

// Crear un track del carrusel
// Crea un contenedor .track que tendrá todas las imágenes
// Alineadas horizontalmente
// Es la base del efecto slide con translateX
function createTrack() {
  // Si no existe no hacer nada
  if (track) return;

  // Si no existe, crea el track
  track = document.createElement('div');
  track.className = 'track';

  data.forEach((item) => {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.title;
    track.appendChild(img);
  });
  frame.prepend(track);
}

// Crear dots
// Crear los botones indicadores del carrusel
// Cada dot va a representar una imagen
// El dot activo debe coincidir con el currentIndex
function createDots() {
  if (!dots) {
    dots = document.createElement('div');
    dots.id = 'dots';
    dots.className = 'dots';
    frame.appendChild(dots);
  }
  dots.innerHTML = data
    .map((_, index) => {
      return `
    <button class="dot ${index === currentIndex ?? 'active'}"
      type="button"
      data-index="${index}"
      aria-label="Ir a la imagen ${index + 1}">
    </button>
    `;
    })
    .join('');
}

// Renderizar las miniaturas
function renderThumbs() {
  thumbs.innerHTML = data
    .map((item, index) => {
      return `
    <article class="thumb ${index === currentIndex ? 'active' : ''}" data-index="${index}">
      <span class="badge">${index + 1}</span>
      <img src="${item.src}" alt="${item.title}">
    </article>
    `;
    })
    .join('');
}

// Función para mostrar la imagen principal
function renderHero(index) {
  const item = data[index];

  // Actualizar imagen principal
  heroImg.src = item.src;
  heroImg.alt = item.title;

  // Actualizar el título y descripción
  heroTitle.textContent = item.title;
  heroDesc.textContent = item.desc;

  // Actualizar el contador
  counter.textContent = `${index + 1} / ${data.length}`;

  // Recorrer miniaturas para mercar la activa
  document.querySelectorAll('.thumb').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });

  // Revisar si la imagen actual tiene like
  const isLiked = likes[item.id] === true;

  // Cambiar el símbolo del botón
  // likeBtn.classList.toggle('on', isLiked);
  likeBtn.textContent = isLiked ? '❤️' : '🤍';

  // Aplicar o quitar la clase visual
  likeBtn.classList.toggle('on', isLiked);
}

// Listener de las Miniaturas
thumbs.addEventListener('click', (e) => {
  const thumb = e.target.closest('.thumb');
  if (!thumb) return; // Si no se hizo click en una miniatura, salir
  currentIndex = Number(thumb.dataset.index); // Actualizar el índice actual
  renderHero(currentIndex); // Renderizar la imagen principal con el nuevo índice
});

// Listener para el botón de "me gusta"
likeBtn.addEventListener('click', () => {
  const currentItem = data[currentIndex];
  // Alternar el estado de "me gusta"
  likes[currentItem.id] = !likes[currentItem.id];

  const isLiked = likes[currentItem.id]; // Verificar el nuevo estado
  likeBtn.textContent = isLiked ? '❤️' : '🤍';
  likeBtn.classList.toggle('on', isLiked); // Aplicar o quitar la clase visual
  likeBtn.setAttribute('aria-pressed', isLiked); // Actualizar el atributo ARIA
});

// Cambiar el botón de "play" a "pause"
function updatePlayButton() {
  playBtn.textContent = isPlaying ? '⏸' : '▶';
  playBtn.dataset.state = isPlaying ? 'pause' : 'play';
}

function changeSlide(newIndex) {
  heroImg.classList.add('fade-out'); // Agregar clase para animación de salida
  setTimeout(() => {
    currentIndex = newIndex; // Actualizar el indice actual
    renderHero(currentIndex); // Renderizar la nueva imagen principal
    heroImg.classList.remove('fade-out'); // Quitar clase para animación de entrada
  }, 350);
}

function nextSlide() {
  const newIndex = (currentIndex + 1) % data.length; // Calcular el índice de la siguiente imagen
  changeSlide(newIndex);
}

function prevSlide() {
  const newIndex = (currentIndex - 1 + data.length) % data.length; // Calcular el índice de la imagen anterior
  changeSlide(newIndex);
}

function startAutoPlay() {
  autoPlayId = setInterval(() => {
    nextSlide();
  }, AUTO_TIME);
  isPlaying = true;
  updatePlayButton();
}

function stopAutoplay() {
  clearInterval(autoPlayId);
  autoPlayId = null;
  isPlaying = false;
  updatePlayButton();
}

function toggleAutoPlay() {
  if (isPlaying) {
    stopAutoplay();
  } else {
    startAutoPlay();
  }
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);
playBtn.addEventListener('click', toggleAutoPlay);

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    nextSlide();
  } else if (e.key === 'ArrowLeft') {
    prevSlide();
  }
});

renderThumbs(); // Llamar a la función para mostrar las miniaturas
renderHero(currentIndex); // Mostrar la imagen inicial