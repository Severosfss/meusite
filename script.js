// Configurações da aplicação
const YOUTUBE_API_KEY = window.config.YOUTUBE_API_KEY;
const RESULTS_PER_PAGE = 12;
const MAX_RESULTS = 50;

// Elementos do DOM
const videosContainer = document.getElementById('videos-container');
const videoModal = document.getElementById('video-modal');
const videoWrapper = document.getElementById('video-wrapper');
const closeButton = document.querySelector('.close-button');
const navLinks = document.querySelectorAll('.nav-links a');
const filterButtons = document.querySelectorAll('.filter-button');
const languageButtons = document.querySelectorAll('.language-button');
const sectionTitle = document.querySelector('.section-title');
const categoryDescription = document.querySelector('.category-description');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');

// Estado atual
let currentCategory = 'tech';
let currentFilter = 'all';
let currentLanguage = 'all';
let currentPage = 1;

    
// Inicializar links quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    loadVideos(currentCategory);
});

let totalPages = 1;
let pageToken = '';
let nextPageToken = '';
let prevPageToken = '';
let cachedVideos = {};

// Categorias
const CATEGORIES = {
    tech: {
        title: 'Notícias em Vídeo sobre Tecnologia',
        description: 'Fique por dentro das últimas novidades do mundo tech através dos melhores vídeos',
        searchQuery: 'tecnologia noticias portugues'
    },
    ai: {
        title: 'Inteligência Artificial',
        description: 'Descubra as últimas inovações em IA e Machine Learning',
        searchQuery: 'inteligencia artificial noticias portugues'
    },
    games: {
        title: 'Desenvolvimento de Games',
        description: 'Novidades e tutoriais sobre desenvolvimento de jogos',
        searchQuery: 'desenvolvimento jogos games portugues'
    },
    innovation: {
        title: 'Inovação Tecnológica',
        description: 'As últimas tendências e inovações em tecnologia',
        searchQuery: 'inovacao tecnologia noticias portugues'
    },
    programming: {
        title: 'Aulas de Programação',
        description: 'Aprenda programação com os melhores tutoriais',
        searchQuery: 'aulas programacao tutorial portugues'
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadVideos(currentCategory);
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.target.closest('a').dataset.category;
        
        navLinks.forEach(l => l.classList.remove('active'));
        e.target.closest('a').classList.add('active');
        
        currentCategory = category;
        currentPage = 1;
        pageToken = '';
        currentFilter = 'all';
        currentLanguage = 'all';
        
        // Reset filter buttons
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === 'all') {
                btn.classList.add('active');
            }
        });

        // Reset language buttons
        languageButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.language === 'all') {
                btn.classList.add('active');
            }
        });
        
        updatePageHeader(category);
        loadVideos(category);
    });
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.filter;
        currentPage = 1;
        pageToken = '';
        loadVideos(currentCategory, currentFilter, currentLanguage);
    });
});

// Add language button event listeners
languageButtons.forEach(button => {
    button.addEventListener('click', () => {
        languageButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentLanguage = button.dataset.language;
        currentPage = 1;
        pageToken = '';
        loadVideos(currentCategory, currentFilter, currentLanguage);
    });
});

prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        pageToken = prevPageToken;
        loadVideos(currentCategory, currentFilter, currentLanguage);
    }
});

nextPageButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        pageToken = nextPageToken;
        loadVideos(currentCategory, currentFilter, currentLanguage);
    }
});

closeButton.addEventListener('click', () => {
    closeVideoModal();
});

videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        closeVideoModal();
    }
});

// Funções principais
async function loadVideos(category, filter = 'all', language = 'all') {
    try {
        showLoading();
        const cacheKey = `${category}_${filter}_${language}_${pageToken}`;
        let videos;

        if (cachedVideos[cacheKey]) {
            videos = cachedVideos[cacheKey];
        } else {
            const searchQuery = getSearchQueryForCategory(category, filter, language);
            const data = await fetchYouTubeVideos(searchQuery);
            videos = data.items;
            nextPageToken = data.nextPageToken || '';
            prevPageToken = data.prevPageToken || '';
            
            cachedVideos[cacheKey] = videos;
        }

        if (videos && videos.length > 0) {
            updatePagination();
            displayVideos(videos);
            
            // Scroll to top after loading new videos
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            showError('Nenhum vídeo encontrado para esta categoria.');
        }
    } catch (error) {
        console.error('Error loading videos:', error);
        showError();
    }
}

function getSearchQueryForCategory(category, filter = 'all', language = 'all') {
    let query = CATEGORIES[category].searchQuery;

    if (language !== 'all') {
        query += ` ${language} programming`;
    }

    switch (filter) {
        case 'beginner':
            query += ' iniciante tutorial';
            break;
        case 'intermediate':
            query += ' intermediário';
            break;
        case 'advanced':
            query += ' avançado';
            break;
        case 'news':
            query += ' notícias';
            break;
        case 'tutorials':
            query += ' tutorial';
            break;
    }

    return query;
}

async function fetchYouTubeVideos(query) {
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${RESULTS_PER_PAGE}&relevanceLanguage=pt&key=${YOUTUBE_API_KEY}`;
    
    if (pageToken) {
        url += `&pageToken=${pageToken}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Erro ao buscar vídeos do YouTube');
    }
    
    const data = await response.json();
    totalPages = Math.min(Math.ceil(MAX_RESULTS / RESULTS_PER_PAGE), 5);
    
    return data;
}

function updatePagination() {
    currentPageSpan.textContent = currentPage;
    totalPagesSpan.textContent = totalPages;
    
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages || !nextPageToken;
}

function displayVideos(videos) {
    videosContainer.innerHTML = '';
    
    if (!videos || videos.length === 0) {
        showError('Nenhum vídeo encontrado');
        return;
    }
    
    videos.forEach(video => {
        const videoCard = createVideoCard(video);
        videosContainer.appendChild(videoCard);
    });
}

function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
        <div class="video-thumbnail">
            <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}">
            <div class="video-play-button"></div>
        </div>
        <div class="video-content">
            <h3 class="video-title">${video.snippet.title}</h3>
            <div class="video-channel">${video.snippet.channelTitle}</div>
            <div class="video-date">${formatDate(video.snippet.publishedAt)}</div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        openVideoModal(video.id.videoId);
    });
    
    return card;
}

function openVideoModal(videoId) {
    videoWrapper.innerHTML = `
        <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/${videoId}?autoplay=1"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
        </iframe>
    `;
    videoModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    videoModal.style.display = 'none';
    videoWrapper.innerHTML = '';
    document.body.style.overflow = 'auto';
}

function updatePageHeader(category) {
    const title = CATEGORIES[category].title;
    const description = CATEGORIES[category].description;
    
    sectionTitle.textContent = title;
    categoryDescription.textContent = description;
}

function showLoading() {
    videosContainer.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            Carregando vídeos...
        </div>
    `;
}

function showError(message = 'Erro ao carregar os vídeos. Por favor, tente novamente.') {
    videosContainer.innerHTML = `
        <div class="error">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Atualizar a visibilidade dos filtros baseado na categoria
function updateFiltersVisibility(category) {
    const languageFilters = document.querySelector('.language-filters');
    if (category === 'programming') {
        languageFilters.style.display = 'flex';
    } else {
        languageFilters.style.display = 'none';
    }
}

// Adicionar ao changeCategory
function changeCategory(category) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.category === category) {
            link.classList.add('active');
        }
    });

    updateFiltersVisibility(category);
    
    const title = CATEGORIES[category].title;
    const description = CATEGORIES[category].description;
    
    document.querySelector('.section-title').textContent = title;
    document.querySelector('.category-description').textContent = description;
    
    currentPageToken = '';
    const filter = document.querySelector('.filter-button.active').dataset.filter;
    const language = document.querySelector('.language-button.active')?.dataset.language || 'all';
    
    loadVideos(category, filter, language);
}
