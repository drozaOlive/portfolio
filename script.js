// ===== DATOS DE PROYECTOS (JSON embebido) =====
const projectsData = {
  "projects": [
    {
      "id": 1,
      "title": "E-Commerce Platform",
      "description": "Plataforma de comercio electrónico completa con carrito de compras y pasarela de pago.",
      "image": "https://cdn.pixabay.com/photo/2015/10/09/00/55/lotus-978659_640.jpg",
      "tags": ["web", "design"],
      "link": "#"
    },
    {
      "id": 2,
      "title": "App de Fitness",
      "description": "Aplicación móvil para seguimiento de ejercicios y nutrición personalizada.",
      "image": "https://www.dzoom.org.es/wp-content/uploads/2019/07/fotografia-flores-primavera-consejos.jpg",
      "tags": ["mobile", "design"],
      "link": "#"
    },
    {
      "id": 3,
      "title": "Dashboard Analítico",
      "description": "Panel de control con visualización de datos en tiempo real y reportes.",
      "image": "https://hips.hearstapps.com/hmg-prod/images/lily-of-the-valley-royalty-free-image-1679985393.jpg?crop=1xw:0.84415xh;0,0.147xh",
      "tags": ["web", "backend"],
      "link": "#"
    },
    {
      "id": 4,
      "title": "Identidad de Marca",
      "description": "Diseño completo de identidad corporativa para startup tecnológica.",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEtsnLK8r07bSGcSeo1iJp1WLZXNIJRDNqZg&s",
      "tags": ["design"],
      "link": "#"
    },
    {
      "id": 5,
      "title": "Portfolio Creativo",
      "description": "Sitio web portfolio con animaciones y diseño responsive.",
      "image": "https://images.unsplash.com/photo-1566669086984-077347c1f4bb?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmxvciUyMGhlcm1vc2F8ZW58MHx8MHx8fDA%3D",
      "tags": ["web"],
      "link": "#"
    },
    {
      "id": 6,
      "title": "API RESTful",
      "description": "API robusta para gestión de usuarios y autenticación JWT.",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpkLGm0468sI_D92nbB0-7MO9tYL9hFIiPig&s",
      "tags": ["backend"],
      "link": "#"
    },
    {
      "id": 7,
      "title": "Sistema de Reservas",
      "description": "Plataforma web para gestión de reservas de hoteles con calendario interactivo.",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRdEGc1G21Um8U36sR123uaQCp3CzIG3AVIQ&s",
      "tags": ["web", "backend"],
      "link": "#"
    },
    {
      "id": 8,
      "title": "App de Delivery",
      "description": "Aplicación móvil de pedidos a domicilio con seguimiento en tiempo real.",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSdyIr2jJzeQEJ0IE80fuditbnX9-LL6HYqQ&s",
      "tags": ["mobile", "backend"],
      "link": "#"
    }
  ]
};

// ===== VARIABLES GLOBALES =====
let allProjects = [];
let currentFilter = 'all';
let currentSearch = '';
let currentPage = 1;
let projectsPerPage = 6;
let filteredProjects = [];
let isTransitioning = false;

// ===== CARGAR PROYECTOS =====
function loadProjects() {
    allProjects = projectsData.projects;
    applyFilters();
}

// ===== APLICAR FILTROS COMBINADOS =====
function applyFilters() {
    filteredProjects = allProjects;
    
    // Aplicar filtro de categoría
    if (currentFilter !== 'all') {
        filteredProjects = filteredProjects.filter(project => 
            project.tags.includes(currentFilter)
        );
    }
    
    // Aplicar filtro de búsqueda
    if (currentSearch) {
        filteredProjects = filteredProjects.filter(project => {
            const titleMatch = project.title.toLowerCase().includes(currentSearch);
            const descMatch = project.description.toLowerCase().includes(currentSearch);
            const tagsMatch = project.tags.some(tag => tag.toLowerCase().includes(currentSearch));
            
            return titleMatch || descMatch || tagsMatch;
        });
    }
    
    // Resetear a página 1 cuando cambian los filtros
    currentPage = 1;
    
    // Renderizar proyectos filtrados
    renderProjects(false);
}

// ===== RENDERIZAR PROYECTOS CON PAGINACIÓN =====
function renderProjects(animate = false, direction = 'down') {
    const projectsGrid = document.getElementById('projectsGrid');
    
    // Si hay animación, primero animar salida
    if (animate && !isTransitioning) {
        isTransitioning = true;
        projectsGrid.classList.add('transitioning');
        projectsGrid.classList.add(direction === 'down' ? 'slide-up' : 'slide-down');
        
        setTimeout(() => {
            actualRender();
            projectsGrid.classList.remove('slide-up', 'slide-down');
            projectsGrid.classList.add(direction === 'down' ? 'slide-up-in' : 'slide-down-in');
            
            setTimeout(() => {
                projectsGrid.classList.remove('transitioning', 'slide-up-in', 'slide-down-in');
                isTransitioning = false;
            }, 500);
        }, 500);
    } else {
        actualRender();
    }
}

function actualRender() {
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = '';
    
    if (filteredProjects.length === 0) {
        projectsGrid.innerHTML = '<p class="no-results">No se encontraron proyectos.</p>';
        updatePaginationControls();
        return;
    }
    
    // Calcular paginación
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    const projectsToShow = filteredProjects.slice(startIndex, endIndex);
    
    // Crear cards
    projectsToShow.forEach((project) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'project-card';
        cardElement.setAttribute('data-tags', project.tags.join(' '));
        cardElement.setAttribute('data-id', project.id);
        cardElement.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
            </div>
        `;
        projectsGrid.appendChild(cardElement);
    });
    
    // Actualizar controles de paginación
    updatePaginationControls();
}

// ===== ACTUALIZAR CONTROLES DE PAGINACIÓN =====
function updatePaginationControls() {
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    
    if (prevBtn && nextBtn && pageInfo) {
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage >= totalPages || filteredProjects.length === 0;
        pageInfo.textContent = filteredProjects.length > 0 ? `${currentPage}/${totalPages}` : '0/0';
    }
}

// ===== NAVEGACIÓN DE PÁGINAS =====
function goToPreviousPage() {
    if (currentPage > 1 && !isTransitioning) {
        currentPage--;
        renderProjects(true, 'up');
    }
}

function goToNextPage() {
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    if (currentPage < totalPages && !isTransitioning) {
        currentPage++;
        renderProjects(true, 'down');
    }
}

// ===== SMOOTH SCROLLING PARA NAVEGACIÓN =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== FORMULARIO DE CONTACTO =====
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;
    
    console.log('Formulario enviado:', { nombre, email, mensaje });
    
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';
    
    this.reset();
    
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
});

// ===== OBSERVER PARA ANIMACIONES DE SKILL CARDS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    
    // Event listeners para paginación
    document.getElementById('prevPage')?.addEventListener('click', goToPreviousPage);
    document.getElementById('nextPage')?.addEventListener('click', goToNextPage);
    
    // Filtros de categoría
    const filterItems = document.querySelectorAll('.filter-item');
    filterItems.forEach(item => {
        item.addEventListener('click', function() {
            filterItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-filter');
            document.getElementById('searchInput').value = '';
            currentSearch = '';
            
            applyFilters();
        });
    });
    
    // Buscador
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value;
        
        if (searchTerm) {
            filterItems.forEach(i => i.classList.remove('active'));
            currentFilter = 'all';
        } else {
            filterItems[0].classList.add('active');
            currentFilter = 'all';
        }
        
        currentSearch = searchTerm.toLowerCase();
        applyFilters();
    });
});
