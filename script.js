// Configuração da API de notícias (usando NewsAPI)
const API_KEY = 'fd5564769ad1452f973334158769bf9c'; // Substitua com sua chave da API
const BASE_URL = 'https://newsapi.org/v2/everything';

// Estado atual da categoria selecionada
let currentCategory = 'technology';

// Elementos do DOM
const newsContainer = document.getElementById('newsContainer');
const navLinks = document.querySelectorAll('.nav-links a');
const modal = document.getElementById('newsModal');
const modalContent = document.getElementById('modalContent');
const closeButton = document.querySelector('.close-button');
const videosContainer = document.getElementById('videosContainer');

// Adicionar eventos aos links de navegação
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.target.dataset.category;
        currentCategory = category;
        
        // Atualizar classe ativa
        navLinks.forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        
        // Mostrar container apropriado
        if (category === 'videos') {
            newsContainer.style.display = 'none';
            videosContainer.style.display = 'grid';
            fetchVideos();
        } else {
            newsContainer.style.display = 'grid';
            videosContainer.style.display = 'none';
            fetchNews(category);
        }
    });
});

// Fechar modal quando clicar no X
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
    modalContent.innerHTML = '';
});

// Fechar modal quando clicar fora dele
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        modalContent.innerHTML = '';
    }
});

// Função para buscar notícias
async function fetchNews(category) {
    try {
        const query = category === 'technology' ? 'technology' : 'artificial intelligence';
        const url = `${BASE_URL}?q=${query}&language=pt&sortBy=publishedAt&apiKey=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'ok') {
            displayNews(data.articles);
        } else {
            throw new Error('Erro ao buscar notícias');
        }
    } catch (error) {
        console.error('Erro:', error);
        newsContainer.innerHTML = `
            <div class="error-message">
                <p>Desculpe, não foi possível carregar as notícias. Tente novamente mais tarde.</p>
            </div>
        `;
    }
}

// Função para buscar o conteúdo completo da notícia
async function fetchFullArticle(url) {
    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        return data.contents;
    } catch (error) {
        console.error('Erro ao buscar artigo completo:', error);
        return null;
    }
}

// Função para extrair o conteúdo principal do HTML
function extractMainContent(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove scripts e estilos
    doc.querySelectorAll('script, style').forEach(el => el.remove());
    
    // Tenta encontrar o conteúdo principal
    const mainContent = doc.querySelector('article') || 
                       doc.querySelector('.article-content') || 
                       doc.querySelector('.post-content') ||
                       doc.querySelector('main') ||
                       doc.body;
    
    return mainContent.innerHTML;
}

// Função para exibir notícia no modal
async function showNewsInModal(article) {
    // Mostrar loading
    modalContent.innerHTML = '<div class="loading">Carregando notícia...</div>';
    modal.style.display = 'block';

    const publishedDate = new Date(article.publishedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    let fullContent = article.content || article.description || '';
    
    // Tenta buscar o conteúdo completo
    const articleContent = await fetchFullArticle(article.url);
    if (articleContent) {
        try {
            fullContent = extractMainContent(articleContent);
        } catch (error) {
            console.error('Erro ao processar conteúdo:', error);
        }
    }

    modalContent.innerHTML = `
        <div class="modal-news-content">
            <img src="${article.urlToImage || 'https://via.placeholder.com/800x400?text=Sem+Imagem'}" 
                 alt="${article.title}" 
                 class="modal-news-image"
                 onerror="this.src='https://via.placeholder.com/800x400?text=Erro+ao+carregar+imagem'">
            <h2 class="modal-news-title">${article.title}</h2>
            <div class="modal-news-meta">
                <span>Fonte: ${article.source.name}</span> | 
                <span>Publicado em: ${publishedDate}</span>
            </div>
            <div class="modal-news-description">
                ${fullContent}
            </div>
            <div class="modal-news-footer">
                <a href="${article.url}" target="_blank" class="source-link">Ver notícia original</a>
            </div>
        </div>
    `;
}

// Função para exibir as notícias
function displayNews(articles) {
    newsContainer.innerHTML = '';
    
    articles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'news-card';
        
        const image = article.urlToImage || 'https://via.placeholder.com/300x200?text=Sem+Imagem';
        const title = article.title || 'Sem título';
        const description = article.description || 'Sem descrição';
        const source = article.source.name || 'Fonte desconhecida';
        
        card.innerHTML = `
            <img src="${image}" alt="${title}" class="news-image" onerror="this.src='https://via.placeholder.com/300x200?text=Erro+ao+carregar+imagem'">
            <div class="news-content">
                <h3 class="news-title">${title}</h3>
                <p class="news-description">${description}</p>
                <p class="news-source">Fonte: ${source}</p>
                <button class="news-link">Ler mais</button>
            </div>
        `;
        
        // Adicionar evento de clique no card
        card.querySelector('.news-link').addEventListener('click', () => {
            showNewsInModal(article);
        });
        
        newsContainer.appendChild(card);
    });
}

// Configuração da API do YouTube
const YOUTUBE_API_KEY = 'AIzaSyA3bjXPkJ6VesGq64sodSXQwL-XfYtDOok';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

// Função para buscar vídeos do YouTube
async function fetchVideos() {
    try {
        const query = 'tecnologia|inteligencia artificial|tech news';
        const url = `${YOUTUBE_API_URL}/search?part=snippet&q=${query}&type=video&order=date&maxResults=12&relevanceLanguage=pt&key=${YOUTUBE_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items) {
            displayVideos(data.items);
        } else {
            throw new Error('Erro ao buscar vídeos');
        }
    } catch (error) {
        console.error('Erro:', error);
        videosContainer.innerHTML = `
            <div class="error-message">
                <p>Desculpe, não foi possível carregar os vídeos. Tente novamente mais tarde.</p>
            </div>
        `;
    }
}

// Função para exibir os vídeos
function displayVideos(videos) {
    videosContainer.innerHTML = '';
    
    videos.forEach(video => {
        const card = document.createElement('div');
        card.className = 'video-card';
        
        const publishedDate = new Date(video.snippet.publishedAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        card.innerHTML = `
            <div class="video-thumbnail">
                <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}">
                <div class="video-play-button"></div>
            </div>
            <div class="video-content">
                <h3 class="video-title">${video.snippet.title}</h3>
                <p class="video-channel">${video.snippet.channelTitle}</p>
                <p class="video-date">${publishedDate}</p>
            </div>
        `;
        
        // Adicionar evento de clique para abrir o vídeo
        card.addEventListener('click', () => {
            showVideoInModal(video.id.videoId);
        });
        
        videosContainer.appendChild(card);
    });
}

// Função para mostrar vídeo no modal
function showVideoInModal(videoId) {
    modalContent.innerHTML = `
        <div class="video-modal-content">
            <div class="video-wrapper">
                <iframe
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Cache das notícias
const newsCache = {
    technology: null,
    ai: null,
    timestamp: null
};

// Função para verificar se o cache está válido (30 minutos)
function isCacheValid() {
    if (!newsCache.timestamp) return false;
    const thirtyMinutes = 30 * 60 * 1000;
    return (Date.now() - newsCache.timestamp) < thirtyMinutes;
}

// Função para atualizar o cache
function updateCache(category, articles) {
    newsCache[category] = articles;
    newsCache.timestamp = Date.now();
}

// Inicializar o site
document.addEventListener('DOMContentLoaded', () => {
    fetchNews(currentCategory);
    
    // Atualizar notícias a cada 30 minutos
    setInterval(() => {
        fetchNews(currentCategory);
    }, 30 * 60 * 1000);
});
