const axios = require('axios');

const getCodeforcesStats = async (username) => {
    if (!username) return null;

    try {
        // Fetch User Info (Rating)
        const infoResponse = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);

        if (infoResponse.data.status !== 'OK' || infoResponse.data.result.length === 0) {
            console.error('Codeforces API User Info Error:', infoResponse.data.comment);
            return null;
        }

        const userInfo = infoResponse.data.result[0];
        const rating = userInfo.rating || 0; // rating can be undefined if unrated

        // Fetch User Status (Solved Problems)
        const statusResponse = await axios.get(`https://codeforces.com/api/user.status?handle=${username}`);

        if (statusResponse.data.status !== 'OK') {
            console.error('Codeforces API User Status Error:', statusResponse.data.comment);
            return null;
        }

        const submissions = statusResponse.data.result;

        // Count unique solved problems
        const solvedProblems = new Set();
        submissions.forEach(sub => {
            if (sub.verdict === 'OK') {
                // A problem is uniquely identified by contestId + index
                const problemId = `${sub.problem.contestId}${sub.problem.index}`;
                solvedProblems.add(problemId);
            }
        });

        const solved = solvedProblems.size;

        return {
            rating,
            solved,
            username
        };

    } catch (error) {
        console.error(`Error fetching Codeforces stats for ${username}:`, error.message);
        return null;
    }
};

const extractCodeforcesUsername = (url) => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        const parts = urlObj.pathname.split('/').filter(p => p);

        // Typical URL: https://codeforces.com/profile/username
        if (parts.includes('profile')) {
            return parts[parts.indexOf('profile') + 1];
        }

        // Fallback or raw username
        return parts[0] || url;
    } catch (e) {
        // Fallback for non-URL strings (assumed to be usernames)
        return url.split('/').pop() || url;
    }
};

module.exports = { getCodeforcesStats, extractCodeforcesUsername };
