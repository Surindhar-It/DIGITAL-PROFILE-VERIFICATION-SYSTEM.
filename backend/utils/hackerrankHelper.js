const axios = require('axios');

const getHackerrankStats = async (username) => {
    try {
        const response = await axios.get(`https://www.hackerrank.com/${username}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const match = response.data.match(/id="initialData">\s*(.*?)\s*<\/script>/is);
        if (match && match[1]) {
            const data = JSON.parse(decodeURIComponent(match[1]));
            let badgesCount = 0;
            
            // Try exact known path first
            try {
                if (data.community?.viewProfiles?.[username]?.badges) {
                    badgesCount = data.community.viewProfiles[username].badges.length;
                }
            } catch(e) {}
            
            // Fallback: search the entire JSON payload and return the max badges array length found
            let maxBadges = badgesCount;
            const findBadges = (obj) => {
                if (!obj || typeof obj !== 'object') return;
                if (Array.isArray(obj.badges)) {
                    maxBadges = Math.max(maxBadges, obj.badges.length);
                }
                Object.values(obj).forEach(val => findBadges(val));
            };
            
            if (maxBadges === 0) findBadges(data);
            
            return {
                username,
                badges: maxBadges
            };
        }

        return {
            username,
            badges: 0
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
        
        let username = null;
        if (parts.length > 0) {
            username = parts[parts.length - 1];
        } else {
            username = url;
        }

        // Cleanup username (remove @ prefix if present)
        if (username.startsWith('@')) {
            username = username.substring(1);
        }
        return username;
    } catch (e) {
        let username = url.split('/').filter(p => p).pop();
        if (username && username.startsWith('@')) {
            username = username.substring(1);
        }
        return username;
    }
};

module.exports = { getHackerrankStats, extractHackerrankUsername };
