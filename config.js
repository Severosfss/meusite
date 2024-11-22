// Configurações da aplicação
const config = {
    YOUTUBE_API_KEY: 'AIzaSyA3bjXPkJ6VesGq64sodSXQwL-XfYtDOok', // Chave da API do YouTube
};

// Exporta as configurações
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else {
    window.config = config;
}
