const API_URL = "https://suitmedia-backend.suitdev.com/api/ideas";
let currentPage = 1;
let itemsPerPage = 10;
let sortOrder = "-published_at";

// Fungsi untuk mengambil data dari API
async function fetchIdeas() {
  const url = `${API_URL}?page[number]=${currentPage}&page[size]=${itemsPerPage}&append[]=small_image&append[]=medium_image&sort=${sortOrder}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Fungsi untuk merender kartu ide
function renderIdeas(ideas) {
  const ideasGrid = document.querySelector(".ideas-grid");
  ideasGrid.innerHTML = "";

  ideas.forEach((idea) => {
    const card = document.createElement("article");
    card.className = "idea-card";
    card.innerHTML = `
            <img src="${idea.medium_image}" alt="${idea.title}" class="card-thumbnail" loading="lazy">
            <h2 class="card-title">${idea.title}</h2>
        `;
    ideasGrid.appendChild(card);
  });
}

// Fungsi untuk memperbarui pagination
function updatePagination(meta) {
  const pagination = document.querySelector(".pagination ul");
  pagination.innerHTML = "";

  for (let i = 1; i <= meta.last_page; i++) {
    const li = document.createElement("li");
    li.innerHTML = `<a href="#" ${
      i === currentPage ? 'class="active"' : ""
    }>${i}</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      loadIdeas();
    });
    pagination.appendChild(li);
  }
}

// Fungsi utama untuk memuat ide-ide
async function loadIdeas() {
  const data = await fetchIdeas();
  renderIdeas(data.data);
  updatePagination(data.meta);
  updateShowingInfo(data.meta);
}

// Fungsi untuk memperbarui informasi "Showing"
function updateShowingInfo(meta) {
  const showing = document.querySelector(".showing");
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, meta.total);
  showing.textContent = `Showing ${start} - ${end} of ${meta.total}`;
}

// Event listener untuk perubahan show-per-page
document.getElementById("show-per-page").addEventListener("change", (e) => {
  itemsPerPage = parseInt(e.target.value);
  currentPage = 1;
  loadIdeas();
});

// Event listener untuk perubahan sort
document.getElementById("sort-by").addEventListener("change", (e) => {
  sortOrder = e.target.value === "newest" ? "-published_at" : "published_at";
  currentPage = 1;
  loadIdeas();
});

// Menangani scroll untuk efek header
let lastScrollTop = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    header.style.top = "-100px"; // Sembunyikan header
  } else {
    header.style.top = "0"; // Tampilkan header
    header.style.backgroundColor = "rgba(255, 255, 255, 0.9)"; // Semi-transparan
  }

  lastScrollTop = scrollTop;
});

// Memuat ide-ide saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadIdeas);
