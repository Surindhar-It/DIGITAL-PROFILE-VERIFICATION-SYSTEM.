const axios = require('axios');

const getGitHubStats = async (username) => {
    if (!username) return null;

    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/vnd.github.v3+json'
        };

        if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }

        const response = await axios.get(`https://api.github.com/users/${username}`, { headers });

        if (response.status !== 200) {
            return null;
        }

        const data = response.data;
        return {
            username: data.login,
            public_repos: data.public_repos,
            followers: data.followers,
            following: data.following
        };
    } catch (error) {
        console.error('Error fetching GitHub stats:', error.message);
        if (error.response && error.response.status === 403) {
            console.error('GitHub API Rate Limit Exceeded');
        }
        return null;
    }
};

const extractGitHubUsername = (url) => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        const parts = urlObj.pathname.split('/').filter(p => p);
        return parts[0];
    } catch (e) {
        return null;
    }
};

module.exports = { getGitHubStats, extractGitHubUsername };
