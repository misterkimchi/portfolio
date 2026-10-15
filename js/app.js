const projectGrid = document.querySelector("#project-grid");
let allProjects = [];

async function loadProjects() {
  try {
    const response = await fetch("data/projects.json");
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    allProjects = await response.json();
    displayProjects(allProjects);
    setupCategoryFilters();
    setupSearchFilter();
  } catch (error) {
    console.error("Error loading projects:", error);
    if (projectGrid) {
      projectGrid.innerHTML = `
        <div class="col-12">
          <p class="text-muted">Unable to load data/projects.json. Test via a local web server (http://localhost), not file://.</p>
        </div>
      `;
    }
  }
}

function displayProjects(projects) {
  projectGrid.innerHTML = "";

  if (projects.length === 0) {
    projectGrid.innerHTML = `
      <div class="col-12">
        <p class="text-muted py-3">no matching projects found.</p>
      </div>
    `;
    return;
  }

  projects.forEach((project) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6";

    const card = document.createElement("article");
    card.classList.add("project-card", "h-100");

    const linkMarkup = project.link
      ? `<div class="mt-2 pt-2 border-top border-secondary">
           <small class="text-muted d-block mb-1">link:</small>
           <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="small text-truncate d-block">${project.link}</a>
         </div>`
      : "";

    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-baseline mb-1">
        <h3 class="h6 fw-bold mb-0">${project.title}</h3>
        <span class="badge bg-secondary">${project.category}</span>
      </div>
      <p class="text-muted small my-2 flex-grow-1">${project.description}</p>
      <p class="small text-muted mb-0"><strong>tech:</strong> ${project.technologies.join(", ")}</p>
      ${linkMarkup}
    `;

    col.appendChild(card);
    projectGrid.appendChild(col);
  });
}

function setupCategoryFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      const category = this.getAttribute("data-category");
      filterProjectsByCategory(category);
    });
  });
}

function filterProjectsByCategory(category) {
  const searchInput = document.getElementById("projectSearchInput");
  if (searchInput) searchInput.value = "";

  if (category === "all") {
    displayProjects(allProjects);
  } else {
    const filtered = allProjects.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
    displayProjects(filtered);
  }
}

function setupSearchFilter() {
  const searchInput = document.getElementById("projectSearchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", function (e) {
    const query = e.target.value.toLowerCase().trim();

    const activeFilterBtn = document.querySelector(".filter-btn.active");
    const currentCategory = activeFilterBtn
      ? activeFilterBtn.getAttribute("data-category")
      : "all";

    const results = allProjects.filter((project) => {
      const matchesCategory =
        currentCategory === "all" ||
        project.category.toLowerCase() === currentCategory.toLowerCase();

      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });

    displayProjects(results);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initBackToTop();
  if (projectGrid) {
    loadProjects();
  }
});

function initBackToTop() {
  const btn = document.getElementById("backToTopBtn");
  if (!btn) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 250) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  });

  btn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}
