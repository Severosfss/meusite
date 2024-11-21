// Elementos do formulário
const form = document.getElementById('cadastroForm');
const senhaInput = document.getElementById('senha');
const confirmarSenhaInput = document.getElementById('confirmarSenha');
const telefoneInput = document.getElementById('telefone');
const togglePasswordButtons = document.querySelectorAll('.toggle-password');

// Máscara para telefone
telefoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 9) {
        value = `${value.slice(0, 9)}-${value.slice(9)}`;
    }
    
    e.target.value = value;
});

// Toggle de visibilidade da senha
togglePasswordButtons.forEach(button => {
    button.addEventListener('click', () => {
        const input = button.parentElement.querySelector('input');
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Validação do formulário
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validar senha
    if (senhaInput.value !== confirmarSenhaInput.value) {
        showError('As senhas não coincidem');
        return;
    }
    
    if (senhaInput.value.length < 6) {
        showError('A senha deve ter pelo menos 6 caracteres');
        return;
    }
    
    // Coletar dados do formulário
    const formData = {
        nome: form.nome.value,
        email: form.email.value,
        senha: form.senha.value,
        telefone: form.telefone.value,
        dataNascimento: form.dataNascimento.value,
        termos: form.termos.checked,
        dataCadastro: new Date().toISOString()
    };
    
    // Salvar usuário
    saveUser(formData);
});

// Função para salvar usuário
function saveUser(userData) {
    // Recuperar usuários existentes
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Verificar se e-mail já existe
    if (users.some(user => user.email === userData.email)) {
        showError('Este e-mail já está cadastrado');
        return;
    }
    
    // Adicionar novo usuário
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Mostrar mensagem de sucesso
    showSuccess('Cadastro realizado com sucesso!');
    
    // Limpar formulário
    form.reset();
}

// Funções de feedback
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error';
    errorDiv.textContent = message;
    
    insertAlert(errorDiv);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.textContent = message;
    
    insertAlert(successDiv);
}

function insertAlert(alertDiv) {
    // Remover alertas existentes
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Inserir novo alerta
    form.insertBefore(alertDiv, form.firstChild);
    
    // Remover alerta após 3 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Adicionar estilos para os alertas
const style = document.createElement('style');
style.textContent = `
    .alert {
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
        animation: slideIn 0.3s ease;
    }
    
    .alert-error {
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.3);
        color: #ff4444;
    }
    
    .alert-success {
        background: rgba(0, 255, 0, 0.1);
        border: 1px solid rgba(0, 255, 0, 0.3);
        color: #00ff00;
    }
    
    @keyframes slideIn {
        from {
            transform: translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;

document.head.appendChild(style);
