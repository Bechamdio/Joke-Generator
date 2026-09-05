// UI Controller
class UIController {
    constructor() {
        this.elements = this.cacheElements();
        this.setupEventListeners();
        this.currentJoke = null;
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        return {
            // Buttons
            getJokeBtn: document.getElementById('get-joke-btn'),
            copyBtn: document.getElementById('copy-btn'),
            shareBtn: document.getElementById('share-btn'),
            clearFavoritesBtn: document.getElementById('clear-favorites-btn'),

            // Display
            jokeDisplay: document.getElementById('joke-display'),
            jokeType: document.getElementById('joke-type'),

            // Controls
            jokeTypeRadios: document.querySelectorAll('input[name="joke-type"]'),

            // Lists
            favoritesList: document.getElementById('favorites-list'),

            // Stats
            jokesCount: document.getElementById('jokes-count'),
            favoritesCount: document.getElementById('favorites-count'),
            apiStatus: document.getElementById('api-status'),

            // Loading & Notifications
            loadingSpinner: document.getElementById('loading-spinner'),
            toast: document.getElementById('toast')
        };
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        this.elements.getJokeBtn.addEventListener('click', () => this.handleGetJoke());
        this.elements.copyBtn.addEventListener('click', () => this.handleCopyJoke());
        this.elements.shareBtn.addEventListener('click', () => this.handleShareJoke());
        this.elements.clearFavoritesBtn.addEventListener('click', () => this.handleClearFavorites());
    }

    /**
     * Handle get joke button click
     */
    async handleGetJoke() {
        this.showLoading(true);
        this.setApiStatus('Loading...');

        const selectedType = document.querySelector('input[name="joke-type"]:checked').value;

        try {
            const joke = await jokeAPI.getJoke(selectedType);
            this.currentJoke = joke;
            this.displayJoke(joke);
            this.setApiStatus('Ready');
            this.updateStats();
        } catch (error) {
            console.error('Error:', error);
            this.showToast('Failed to load joke', 'error');
            this.setApiStatus('Error');
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Display joke on screen
     */
    displayJoke(joke) {
        // Animate out
        this.elements.jokeDisplay.style.opacity = '0';

        setTimeout(() => {
            this.elements.jokeDisplay.innerHTML = `<p>${joke.joke}</p>`;
            this.elements.jokeType.textContent = joke.type;

            // Animate in
            this.elements.jokeDisplay.style.opacity = '1';
        }, 150);
    }

    /**
     * Handle copy joke
     */
    handleCopyJoke() {
        if (!this.currentJoke) {
            this.showToast('No joke to copy', 'info');
            return;
        }

        const jokeText = this.currentJoke.joke;
        navigator.clipboard.writeText(jokeText).then(() => {
            this.showToast('Joke copied to clipboard! 📋', 'success');
        }).catch(() => {
            this.showToast('Failed to copy joke', 'error');
        });
    }

    /**
     * Handle share joke
     */
    handleShareJoke() {
        if (!this.currentJoke) {
            this.showToast('No joke to share', 'info');
            return;
        }

        if (navigator.share) {
            navigator.share({
                title: 'Check out this joke!',
                text: this.currentJoke.joke
            }).catch(err => console.log('Error sharing:', err));
        } else {
            this.showToast('Share not supported on this browser', 'info');
        }
    }

    /**
     * Handle clear favorites
     */
    handleClearFavorites() {
        if (storageManager.getFavorites().length === 0) {
            this.showToast('No favorites to clear', 'info');
            return;
        }

        if (confirm('Are you sure you want to clear all favorites?')) {
            storageManager.clearFavorites();
            this.renderFavorites();
            this.updateStats();
            this.showToast('Favorites cleared', 'info');
        }
    }

    /**
     * Add favorite
     */
    addFavorite(joke) {
        storageManager.addFavorite(joke);
        this.renderFavorites();
        this.updateStats();
        this.showToast('Added to favorites! ⭐', 'success');
    }

    /**
     * Remove favorite
     */
    removeFavorite(index) {
        storageManager.removeFavorite(index);
        this.renderFavorites();
        this.updateStats();
        this.showToast('Removed from favorites', 'info');
    }

    /**
     * Render favorites list
     */
    renderFavorites() {
        const favorites = storageManager.getFavorites();
        const listContainer = this.elements.favoritesList;

        if (favorites.length === 0) {
            listContainer.innerHTML = '<p class="empty-message">No favorites yet. Click the ❤️ to save jokes!</p>';
            return;
        }

        listContainer.innerHTML = favorites.map((joke, index) => `
            <div class="favorite-item">
                <div class="favorite-joke">${joke.joke}</div>
                <button class="remove-favorite" onclick="ui.removeFavorite(${index})">Remove</button>
            </div>
        `).join('');
    }

    /**
     * Update statistics
     */
    updateStats() {
        this.elements.jokesCount.textContent = jokeAPI.getJokeCount();
        this.elements.favoritesCount.textContent = storageManager.getFavorites().length;
    }

    /**
     * Show loading spinner
     */
    showLoading(show) {
        if (show) {
            this.elements.loadingSpinner.classList.remove('hidden');
            this.elements.getJokeBtn.disabled = true;
        } else {
            this.elements.loadingSpinner.classList.add('hidden');
            this.elements.getJokeBtn.disabled = false;
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        this.elements.toast.textContent = message;
        this.elements.toast.className = `toast show ${type}`;

        setTimeout(() => {
            this.elements.toast.classList.remove('show');
        }, 3000);
    }

    /**
     * Set API status
     */
    setApiStatus(status) {
        this.elements.apiStatus.textContent = status;
    }
}

// Create global UI instance
const ui = new UIController();