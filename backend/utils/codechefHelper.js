const axios = require('axios');

const getCodeChefStats = async (username) => {
    try {
        // CodeChef does not have a public API, so we might need to rely on 
        // a third-party API or scraping. 
        // For this implementation, we will use a known competitive programming API 
        // or a scraping method if feasible.
        // Let's try to use the 'codechef-api' if available or fallback to a custom scraper.

        // Since we cannot easily install new packages without user permission,
        // and standard scraping might be blocked or unstable, 
        // we will attempt to fetch from the profile page using standard axios and string parsing
        // which is a lightweight "scraping" method.

        const response = await axios.get(`https://www.codechef.com/users/${username}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const html = response.data;

        // Parse Rating
        // <div class="rating-number">2054</div>
        const ratingMatch = html.match(/<div class="rating-number">(\d+)<\/div>/);
        const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0;

        // Parse Stars
        // <span class="rating">4★</span>
        const starsMatch = html.match(/<span class="rating">(\d+)★<\/span>/);
        const stars = starsMatch ? parseInt(starsMatch[1]) : 0;

        // Parse Global Rank
        // <strong>Global Rank:</strong> 1234
        // This is often in the sidebar, let's look for the structure
        const globalRankMatch = html.match(/Global Rank:.*?<strong>(\d+)<\/strong>/s);
        const globalRank = globalRankMatch ? parseInt(globalRankMatch[1]) : 0;

        // Parse Country Rank
        const countryRankMatch = html.match(/Country Rank:.*?<strong>(\d+)<\/strong>/s);
        const countryRank = countryRankMatch ? parseInt(countryRankMatch[1]) : 0;

        return {
            rating,
            stars,
            globalRank,
            countryRank,
            username
        };

    } catch (error) {
        console.error(`Error fetching CodeChef stats for ${username}:`, error.message);
        return null;
    }
};

const extractCodeChefUsername = (url) => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        const parts = urlObj.pathname.split('/').filter(p => p);
        // https://www.codechef.com/users/username -> parts=['users', 'username']
        // https://www.codechef.com/username -> parts=['username']

        if (parts.includes('users')) {
            return parts[parts.indexOf('users') + 1];
        }
        return parts[0];
    } catch (e) {
        // Fallback for non-URL strings (assumed to be usernames)
        return url.split('/').pop();
    }
};

module.exports = { getCodeChefStats, extractCodeChefUsername };
