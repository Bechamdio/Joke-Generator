// Main Application Controller
class JokeGeneratorApp {
    constructor() {
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        console.log('🎉 Joke Generator App Initialized');
        
        // Load saved favorites
        ui.renderFavorites();
        
        // Update stats
        ui.updateStats();
        
        // Add fade-in animation to joke display
        ui.elements.jokeDisplay.style.transition = 'opacity 0.3s ease';
        ui.elements.jokeDisplay.style.opacity = '1';

        // Check storage availability
        if (!storageManager.isStorageAvailable()) {
            ui.showToast('Local storage not available - favorites may not persist', 'warning');
        }

        // Add keyboard shortcut for getting jokes (spacebar)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                ui.handleGetJoke();
            }
        });
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new JokeGeneratorApp();
    });
} else {
    new JokeGeneratorApp();
}