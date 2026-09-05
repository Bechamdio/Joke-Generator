// Joke API Handler
class JokeAPI {
    constructor() {
        this.jokeCount = 0;
        this.lastJoke = null;
    }

    /**
     * Get a random joke from multiple APIs
     * @param {string} type - Type of joke to fetch
     * @returns {Promise<Object>} - Joke object with type and content
     */
    async getJoke(type = 'general') {
        try {
            let joke;

            switch (type) {
                case 'programming':
                    joke = await this.getProgrammingJoke();
                    break;
                case 'knock-knock':
                    joke = await this.getKnockKnockJoke();
                    break;
                case 'dad':
                    joke = await this.getDadJoke();
                    break;
                default:
                    joke = await this.getGeneralJoke();
            }

            this.lastJoke = joke;
            this.jokeCount++;
            return joke;
        } catch (error) {
            console.error('Error fetching joke:', error);
            return this.getOfflineJoke();
        }
    }

    /**
     * Get a general joke from JokeAPI
     */
    async getGeneralJoke() {
        const response = await fetch('https://v2.jokeapi.dev/joke/General?type=single');
        if (!response.ok) throw new Error('Failed to fetch general joke');

        const data = await response.json();
        return {
            type: 'General',
            joke: data.joke || data.setup + ' ' + data.delivery,
            source: 'JokeAPI'
        };
    }

    /**
     * Get a programming joke from JokeAPI
     */
    async getProgrammingJoke() {
        const response = await fetch('https://v2.jokeapi.dev/joke/Programming?type=single');
        if (!response.ok) throw new Error('Failed to fetch programming joke');

        const data = await response.json();
        return {
            type: 'Programming',
            joke: data.joke || data.setup + ' ' + data.delivery,
            source: 'JokeAPI'
        };
    }

    /**
     * Get a knock-knock joke from JokeAPI
     */
    async getKnockKnockJoke() {
        const response = await fetch('https://v2.jokeapi.dev/joke/Knock-Knock?type=knockknock');
        if (!response.ok) throw new Error('Failed to fetch knock-knock joke');

        const data = await response.json();
        return {
            type: 'Knock-Knock',
            joke: `Knock knock!\nWho's there?\n${data.setup}\n${data.setup} who?\n${data.delivery}`,
            source: 'JokeAPI'
        };
    }

    /**
     * Get a dad joke from icanhazdadjoke API
     */
    async getDadJoke() {
        const response = await fetch('https://icanhazdadjoke.com/?format=json');
        if (!response.ok) throw new Error('Failed to fetch dad joke');

        const data = await response.json();
        return {
            type: 'Dad Joke',
            joke: data.joke,
            source: 'icanhazdadjoke'
        };
    }

    /**
     * Get an offline joke (fallback)
     */
    getOfflineJoke() {
        const offlineJokes = [
            {
                type: 'Offline',
                joke: 'Why did the scarecrow win an award? Because he was outstanding in his field!',
                source: 'Offline Cache'
            },
            {
                type: 'Offline',
                joke: 'I told my computer I needed a break, and now it won\'t stop sending me Kit-Kat ads.',
                source: 'Offline Cache'
            },
            {
                type: 'Offline',
                joke: 'Why don\'t scientists trust atoms? Because they make up everything!',
                source: 'Offline Cache'
            },
            {
                type: 'Offline',
                joke: 'What do you call a fake noodle? An impasta!',
                source: 'Offline Cache'
            },
            {
                type: 'Offline',
                joke: 'Why did the math book look sad? Because it had too many problems!',
                source: 'Offline Cache'
            }
        ];

        return offlineJokes[Math.floor(Math.random() * offlineJokes.length)];
    }

    /**
     * Get joke count
     */
    getJokeCount() {
        return this.jokeCount;
    }

    /**
     * Get last joke fetched
     */
    getLastJoke() {
        return this.lastJoke;
    }
}

// Create global instance
const jokeAPI = new JokeAPI();