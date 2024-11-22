// Exemplo de configuração - Copie este arquivo para config.js e substitua os valores
const config = {
    YOUTUBE_API_KEY: 'YOUR_API_KEY_HERE', // Substitua pela sua chave da API do YouTube
};

// Exporta as configurações
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else {
    window.config = config;
}
