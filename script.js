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