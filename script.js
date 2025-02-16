// Котик
const cat = document.querySelector('.cat');
let currentTarget = null;
let isMoving = false;

function getRandomElement() {
    const elements = [
        ...document.querySelectorAll('.repo-card'),
        document.querySelector('h1'),
        ...document.querySelectorAll('.contact-info a')
    ];
    return elements[Math.floor(Math.random() * elements.length)];
}

// Функция для создания следов от лапок
function createPawPrint(x, y) {
    const pawPrint = document.createElement('div');
    pawPrint.className = 'paw-print';
    pawPrint.style.left = `${x}px`;
    pawPrint.style.top = `${y}px`;
    document.body.appendChild(pawPrint);

    // Удаляем след после завершения анимации
    setTimeout(() => {
        pawPrint.remove();
    }, 2000);
}

// Добавляем следы при движении котика
function moveToElement(element) {
    if (!element || isMoving) return;
    
    isMoving = true;
    cat.classList.add('walking');
    
    const catRect = cat.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    const targetX = elementRect.left + (elementRect.width / 2) - (catRect.width / 2);
    const targetY = elementRect.top - catRect.height + 10;
    
    // Создаем следы на пути котика
    const startX = catRect.left;
    const startY = catRect.top;
    const distance = Math.sqrt(Math.pow(targetX - startX, 2) + Math.pow(targetY - startY, 2));
    const steps = Math.floor(distance / 30);

    for (let i = 1; i <= steps; i++) {
        const progress = i / steps;
        const currentX = startX + (targetX - startX) * progress;
        const currentY = startY + (targetY - startY) * progress;
        
        setTimeout(() => {
            createPawPrint(currentX, currentY);
        }, i * 100);
    }
    
    if (targetX > catRect.left) {
        cat.style.transform = 'scaleX(1)';
    } else {
        cat.style.transform = 'scaleX(-1)';
    }
    
    cat.style.left = `${targetX}px`;
    cat.style.top = `${targetY}px`;
    
    setTimeout(() => {
        cat.classList.remove('walking');
        isMoving = false;
        currentTarget = null;
    }, 2000);
}

// Каждые 4 секунды котик ищет новую цель
setInterval(() => {
    if (!currentTarget && !isMoving) {
        currentTarget = getRandomElement();
        moveToElement(currentTarget);
    }
}, 4000);

// Обработка наведения мыши
document.addEventListener('mousemove', (e) => {
    if (isMoving) return;
    
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    
    // Проверяем, есть ли элементы и не навели ли мы на самого котика
    if (elements.length > 0 && elements[0].classList && elements[0].classList.contains('cat')) return;
    
    const targetElement = elements.find(el => 
        el && el.classList && (
            el.classList.contains('repo-card') || 
            el.tagName === 'H1' || 
            el.classList.contains('email-link') ||
            el.classList.contains('github-link') ||
            el.classList.contains('telegram-link')
        )
    );
    
    if (targetElement && targetElement !== currentTarget) {
        currentTarget = targetElement;
        moveToElement(targetElement);
    }
});

async function fetchUserProfile() {
    try {
        const response = await fetch('https://api.github.com/users/AlestackOverglow');
        const userData = await response.json();

        // Обновляем фото профиля
        const profileImage = document.querySelector('.profile-image');
        profileImage.innerHTML = `<img src="${userData.avatar_url}" alt="Profile Photo">`;
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

async function fetchRepositories() {
    try {
        const response = await fetch('https://api.github.com/users/AlestackOverglow/repos');
        const repositories = await response.json();

        const reposContainer = document.getElementById('repositories');
        reposContainer.innerHTML = '';

        repositories.forEach(repo => {
            if (!repo.fork) { // Показываем только не форкнутые репозитории
                const repoCard = document.createElement('a');
                repoCard.href = repo.html_url;
                repoCard.target = '_blank';
                repoCard.className = 'repo-card';

                const description = repo.description || 'No description available';
                
                repoCard.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${description}</p>
                    <div class="repo-stats">
                        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                        <span><i class="fas fa-code"></i> ${repo.language || 'N/A'}</span>
                    </div>
                `;

                reposContainer.appendChild(repoCard);
            }
        });
    } catch (error) {
        console.error('Error fetching repositories:', error);
        document.getElementById('repositories').innerHTML = `
            <p style="text-align: center; color: red;">
                Error loading repositories. Please try again later.
            </p>
        `;
    }
}

// Загружаем данные при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    fetchUserProfile();
    fetchRepositories();
}); 