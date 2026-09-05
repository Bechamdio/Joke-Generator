// Local Storage Manager
class StorageManager {
    constructor() {
        this.storageKey = 'jokeGeneratorFavorites';
    }

    /**
     * Add joke to favorites
     */
    addFavorite(joke) {
        const favorites = this.getFavorites();
        
        // Check if joke already exists
        if (!favorites.some(fav => fav.joke === joke.joke)) {
            favorites.push({
                joke: joke.joke,
                type: joke.type,
                timestamp: new Date().toISOString()
            });
            this.saveFavorites(favorites);
        }
    }

    /**
     * Remove joke from favorites
     */
    removeFavorite(index) {
        const favorites = this.getFavorites();
        favorites.splice(index, 1);
        this.saveFavorites(favorites);
    }

    /**
     * Get all favorites
     */
    getFavorites() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading favorites:', error);
            return [];
        }
    }

    /**
     * Save favorites to localStorage
     */
    saveFavorites(favorites) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }

    /**
     * Clear all favorites
     */
    clearFavorites() {
        localStorage.removeItem(this.storageKey);
    }

    /**
     * Export favorites as JSON
     */
    exportFavorites() {
        const favorites = this.getFavorites();
        return JSON.stringify(favorites, null, 2);
    }

    /**
     * Check if storage is available
     */
    isStorageAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
}

// Create global storage instance
const storageManager = new StorageManager();