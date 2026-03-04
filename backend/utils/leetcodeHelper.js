const axios = require('axios');

const getLeetCodeStats = async (username) => {
    if (!username) return null;

    try {
        const query = `
        query userProblemsSolved($username: String!) {
            allQuestionsCount {
                difficulty
                count
            }
            matchedUser(username: $username) {
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                        submissions
                    }
                }
            }
        }`;

        const response = await axios.post('https://leetcode.com/graphql', {
            query,
            variables: { username }
        });

        if (response.data.errors) {
            console.error('LeetCode GraphQL Error:', response.data.errors);
            return null;
        }

        const stats = response.data.data.matchedUser.submitStats.acSubmissionNum;
        let easy = 0, medium = 0, hard = 0, total = 0;

        stats.forEach(stat => {
            if (stat.difficulty === 'All') total = stat.count;
            if (stat.difficulty === 'Easy') easy = stat.count;
            if (stat.difficulty === 'Medium') medium = stat.count;
            if (stat.difficulty === 'Hard') hard = stat.count;
        });

        return { easy, medium, hard, total };
    } catch (error) {
        console.error('Error fetching LeetCode stats:', error.message);
        return null;
    }
};

const extractLeetCodeUsername = (url) => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        const parts = urlObj.pathname.split('/').filter(p => p);
        if (parts[0] === 'u') return parts[1];
        return parts[0];
    } catch (e) {
        return null;
    }
};

module.exports = { getLeetCodeStats, extractLeetCodeUsername };
