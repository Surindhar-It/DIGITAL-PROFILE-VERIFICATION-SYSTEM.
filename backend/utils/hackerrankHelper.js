const axios = require('axios');

const getHackerrankStats = async (username) => {
    try {
        // HackerRank REST API for badges
        const response = await axios.get(`https://www.hackerrank.com/rest/hackers/${username}/badges`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const badgesArray = response.data.models || [];
        const badgesCompleted = badgesArray.length;

        return {
            username,
            badges: badgesCompleted
        };
    } catch (error) {
        console.error(`Error fetching HackerRank stats for ${username}:`, error.message);
        return null;
    }
};

const extractHackerrankUsername = (url) => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        const parts = urlObj.pathname.split('/').filter(p => p);
        // https://www.hackerrank.com/username -> format
        if (parts.length > 0) {
            return parts[parts.length - 1];
        }
        return url;
    } catch (e) {
        return url.split('/').pop();
    }
};

module.exports = { getHackerrankStats, extractHackerrankUsername };
