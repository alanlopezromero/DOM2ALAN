const data = [
  { id: "p01", title: "Aurora", desc: "Luz suave y cielo polar", src: "https://picsum.photos/id/1018/1200/675" },
  { id: "p02", title: "Montaña", desc: "Rocas y niebla", src: "https://picsum.photos/id/1015/1200/675" },
  { id: "p03", title: "Ciudad", desc: "Atardecer urbano", src: "https://picsum.photos/id/1011/1200/675" },
  { id: "p04", title: "Bosque", desc: "Verde profundo", src: "https://picsum.photos/id/1020/1200/675" },
  { id: "p05", title: "Mar", desc: "Horizonte y calma", src: "https://picsum.photos/id/1016/1200/675" },
  { id: "p06", title: "Ruta", desc: "Camino en perspectiva", src: "https://picsum.photos/id/1005/1200/675" }
];

// recuperar elementos del DOM
const thumbs = document.querySelector("#thumbs");
const heroImg = document.getElementById("heroImg");
const heroTitle = document.getElementById("heroTitle");
const heroDesc = document.getElementById("heroDesc");
const counter = document.getElementById("counter");

const likeBtn = document.getElementById("likeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playBtn = document.getElementById("playBtn");

//trabajar con el estado de la aplicación
let currentIndex = 1;//indice de la imagen actual
const likes = {};//objeto para almacenar los "me gusta"

//renderizar la miniaturas
function renderThumbs() {
  thumbs.innerHTML = data.map((item, index) => {
    return `
    <article class="thumb ${index === currentIndex ? "active" : ""}" data-index="${index}">
       <span class="badge">${index + 1}</span>
       <img src="${item.src}" alt="${item.title}">
       </article>
    `;
  }).join("");
}

function renderHero(index) {
  const item = data[index];

  //actualizar la imagen principal
  heroImg.src = item.src;
  heroImg.alt = item.title;

  //actualizar el título y la descripción
  heroTitle.textContent = item.title;
  heroDesc.textContent = item.desc;

  //actualizar el contador
  counter.textContent = `${index + 1} / ${data.length}`;

  //recorrer miniatura para marcarla activa
  document.querySelectorAll(".thumb").forEach((thumb, i) => {
    thumb.classList.toggle("active", i === index);
  });

  //revisar si la imagen actual tiene "me gusta"
  const isLiked = likes[item.id] === true;

  //cambiar el simbolo del boton
  likeBtn.textContent = isLiked ? "❤️" : "🤍";

  //aplicamos o quitamos la clase visual
  likeBtn.classList.toggle("on", isLiked);

  // Listener para clicks en las miniaturas
  thumbs.addEventListener("click", (e) => {
    const thumb = e.target.closest(".thumb");
    if (!thumb) return; // Si no se hizo click en una miniatura, salir
    currentIndex = Number(thumb.dataset.index); // Actualizar el índice actual
    renderHero(currentIndex); // Renderizar la imagen principal con el nuevo índice
  });
  
}

renderThumbs(); // llamar ala funcion para mostrar las miniaturas
renderHero(currentIndex||0); // mostrar la imagen inicial