// Menu Mobile
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
    if (!menuOpen) {
        menuBtn.classList.add('open');
        navLinks.classList.add('active');
        menuOpen = true;
    } else {
        menuBtn.classList.remove('open');
        navLinks.classList.remove('active');
        menuOpen = false;
    }
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scroll para Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        // Fecha o menu mobile se estiver aberto
        if (menuOpen) {
            menuBtn.classList.remove('open');
            navLinks.classList.remove('active');
            menuOpen = false;
        }
    });
});

// Animação de Elementos no Scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        if (elementPosition < screenPosition - 100) {
            element.classList.add('visible');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Validação do Formulário
const contactForm = document.getElementById('contactForm');
const formGroups = document.querySelectorAll('.form-group');

const validateInput = (input) => {
    const formGroup = input.parentElement;
    const feedback = formGroup.querySelector('.form-feedback');
    
    if (input.validity.valid) {
        formGroup.classList.remove('error');
        feedback.textContent = '';
        return true;
    } else {
        formGroup.classList.add('error');
        if (input.validity.valueMissing) {
            feedback.textContent = 'Este campo é obrigatório';
        } else if (input.validity.typeMismatch && input.type === 'email') {
            feedback.textContent = 'Por favor, insira um email válido';
        }
        return false;
    }
};

formGroups.forEach(group => {
    const input = group.querySelector('input, textarea');
    input.addEventListener('blur', () => validateInput(input));
    input.addEventListener('input', () => validateInput(input));
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    
    if (isValid) {
        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon');
        
        // Animação de envio
        submitBtn.disabled = true;
        btnText.textContent = 'Enviando...';
        btnIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                btnText.textContent = 'Enviado!';
                btnIcon.innerHTML = '<i class="fas fa-check"></i>';
                contactForm.reset();
                
                // Reset do botão após 2 segundos
                setTimeout(() => {
                    submitBtn.disabled = false;
                    btnText.textContent = 'Enviar';
                    btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
                }, 2000);
            } else {
                throw new Error('Erro ao enviar');
            }
        } catch (error) {
            btnText.textContent = 'Erro ao enviar';
            btnIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
            
            // Reset do botão após 2 segundos
            setTimeout(() => {
                submitBtn.disabled = false;
                btnText.textContent = 'Enviar';
                btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
            }, 2000);
        }
    }
});

// Slider de Serviços Touch
const servicesSlider = document.querySelector('.services-slider');
let isDown = false;
let startX;
let scrollLeft;

servicesSlider.addEventListener('mousedown', (e) => {
    isDown = true;
    servicesSlider.classList.add('active');
    startX = e.pageX - servicesSlider.offsetLeft;
    scrollLeft = servicesSlider.scrollLeft;
});

servicesSlider.addEventListener('mouseleave', () => {
    isDown = false;
    servicesSlider.classList.remove('active');
});

servicesSlider.addEventListener('mouseup', () => {
    isDown = false;
    servicesSlider.classList.remove('active');
});

servicesSlider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - servicesSlider.offsetLeft;
    const walk = (x - startX) * 2;
    servicesSlider.scrollLeft = scrollLeft - walk;
});