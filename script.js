const apiUrl = 'https://api.github.com/users';

// DOM Elements
const form = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const errorMsg = document.getElementById('error-msg');
const contentArea = document.getElementById('content-area');
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Language Colors (Based on GitHub's language-colors)
const languageColors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    Shell: '#89e051',
    Vue: '#41b883',
    Svelte: '#ff3e00',
    Jupyter: '#DA5B0B'
};

// Default language color
const defaultLangColor = '#ededed';

// Check theme preference on load
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        htmlElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
}

// Toggle Theme
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Event Listeners
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = searchInput.value.trim();
    if (username) {
        fetchUserData(username);
    }
});

searchInput.addEventListener('input', () => {
    errorMsg.style.display = 'none';
});

// API Calls
async function fetchUserData(username) {
    showLoading();
    errorMsg.style.display = 'none';

    try {
        const userResp = await fetch(`${apiUrl}/${username}`);
        
        if (userResp.status === 404) {
            showError('User not found. Try another username.');
            return;
        }

        if (userResp.status === 403) {
             showError('API rate limit exceeded. Please try again later.');
             return;
        }

        if (!userResp.ok) {
            showError(`An error occurred: ${userResp.statusText}`);
            return;
        }

        const userData = await userResp.json();
        
        const reposResp = await fetch(`${apiUrl}/${username}/repos?sort=stars&per_page=15`);
        const reposData = await reposResp.json();
        
        renderProfile(userData, reposData);
        
    } catch (error) {
        showError('Network error. Please check your connection.');
        console.error(error);
    }
}

// UI State Management
function showLoading() {
    contentArea.innerHTML = `
        <div class="loading-skeleton">
            <div class="skeleton-profile">
                <div class="skeleton-avatar"></div>
                <div class="skeleton-content">
                    <div class="skeleton-line short"></div>
                    <div class="skeleton-line medium"></div>
                    <div class="skeleton-line long"></div>
                    <div class="skeleton-stats">
                        <div class="skeleton-stat"></div>
                        <div class="skeleton-stat"></div>
                        <div class="skeleton-stat"></div>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 2rem;">
                <div class="skeleton-line short" style="margin-bottom: 1.5rem;"></div>
                <div class="skeleton-repos">
                    <div class="skeleton-repo"></div>
                    <div class="skeleton-repo"></div>
                    <div class="skeleton-repo"></div>
                    <div class="skeleton-repo"></div>
                    <div class="skeleton-repo"></div>
                    <div class="skeleton-repo"></div>
                </div>
            </div>
        </div>
    `;
}

function showError(message) {
    form.classList.add('error');
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    
    contentArea.innerHTML = `
        <div class="error-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--error-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <h2>Not Found</h2>
            <p>${message}</p>
        </div>
    `;
    
    setTimeout(() => {
        form.classList.remove('error');
    }, 2000);
}

// Render Data
function renderProfile(user, repos) {
    // Format date
    const joinedDate = new Date(user.created_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const hasBio = user.bio ? user.bio : 'This profile has no bio';
    const noBioClass = user.bio ? '' : 'no-bio';

    // SVG Icons
    const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
    const linkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
    const twitterIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>`;
    const companyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>`;

    const formatUrl = (url) => {
        if (!url) return '';
        if (!url.startsWith('http')) return `https://${url}`;
        return url;
    };

    const twitterUrl = user.twitter_username ? `https://twitter.com/${user.twitter_username}` : '';

    let html = `
        <div class="profile-card">
            <img src="${user.avatar_url}" alt="${user.login}" class="profile-avatar">
            
            <div class="profile-info">
                <div class="profile-header">
                    <h2>
                        ${user.name || user.login}
                        <a href="${user.html_url}" target="_blank" rel="noopener noreferrer" class="github-link">@${user.login}</a>
                    </h2>
                    <span class="join-date">Joined ${joinedDate}</span>
                </div>

                <p class="profile-bio ${noBioClass}">${hasBio}</p>

                <div class="profile-stats">
                    <div class="stat-item">
                        <span class="stat-label">Repos</span>
                        <span class="stat-value">${user.public_repos}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Followers</span>
                        <span class="stat-value">${user.followers}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Following</span>
                        <span class="stat-value">${user.following}</span>
                    </div>
                </div>

                <div class="profile-links">
                    <div class="link-item" style="opacity: ${user.location ? '1' : '0.5'}">
                        ${locationIcon}
                        <span>${user.location || 'Not Available'}</span>
                    </div>
                    <div class="link-item" style="opacity: ${user.blog ? '1' : '0.5'}">
                        ${linkIcon}
                        ${user.blog ? `<a href="${formatUrl(user.blog)}" target="_blank" rel="noopener noreferrer">${user.blog}</a>` : '<span>Not Available</span>'}
                    </div>
                    <div class="link-item" style="opacity: ${user.twitter_username ? '1' : '0.5'}">
                        ${twitterIcon}
                        ${user.twitter_username ? `<a href="${twitterUrl}" target="_blank" rel="noopener noreferrer">@${user.twitter_username}</a>` : '<span>Not Available</span>'}
                    </div>
                    <div class="link-item" style="opacity: ${user.company ? '1' : '0.5'}">
                        ${companyIcon}
                        <span>${user.company || 'Not Available'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Process Repositories
    if (repos && repos.length > 0) {
        html += `
            <div class="repos-section">
                <h2>Top Repositories</h2>
                <div class="repos-grid">
        `;

        repos.forEach(repo => {
            const langColor = languageColors[repo.language] || defaultLangColor;
            const desc = repo.description || 'No description provided.';
            
            html += `
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-card">
                    <div class="repo-name">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                        ${repo.name}
                    </div>
                    <div class="repo-desc">${desc}</div>
                    <div class="repo-stats">
                        ${repo.language ? `
                            <div class="repo-stat-item">
                                <span class="repo-lang-color" style="background-color: ${langColor}"></span>
                                ${repo.language}
                            </div>
                        ` : ''}
                        <div class="repo-stat-item" title="Stars">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            ${repo.stargazers_count}
                        </div>
                        <div class="repo-stat-item" title="Forks">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="6" r="3"></circle><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path><path d="M12 12v3"></path></svg>
                            ${repo.forks_count}
                        </div>
                    </div>
                </a>
            `;
        });

        html += `
                </div>
            </div>
            <div class="view-more-container">
                <a href="${user.html_url}?tab=repositories" target="_blank" rel="noopener noreferrer" class="view-all-btn">View All Repositories on GitHub</a>
            </div>
        `;
    }

    contentArea.innerHTML = html;
}

// Initialize
initTheme();
