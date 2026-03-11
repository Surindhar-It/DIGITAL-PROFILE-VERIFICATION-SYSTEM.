const cron = require('node-cron');
const Student = require('../models/Student');
const { getLeetCodeStats, extractLeetCodeUsername } = require('./leetcodeHelper');
const { getGitHubStats, extractGitHubUsername } = require('./githubHelper');
const { getCodeChefStats, extractCodeChefUsername } = require('./codechefHelper');
const { getCodeforcesStats, extractCodeforcesUsername } = require('./codeforcesHelper');

/**
 * Refreshes LeetCode, GitHub, and CodeChef stats for a single student.
 * Returns a summary object with the result.
 */
const refreshStudentStats = async (student) => {
    const result = { id: student._id, name: student.name, updated: [], errors: [] };
    let scores = student.scores ? { ...student.scores.toObject ? student.scores.toObject() : student.scores } : {};

    // --- LeetCode ---
    if (student.profiles && student.profiles.leetcode) {
        const username = extractLeetCodeUsername(student.profiles.leetcode);
        if (username) {
            try {
                const stats = await getLeetCodeStats(username);
                if (stats) {
                    student.leetcodeStats = stats;
                    scores.leetcode = stats.total;
                    result.updated.push(`LeetCode (${stats.total} solved)`);
                }
            } catch (err) {
                result.errors.push(`LeetCode: ${err.message}`);
            }
        }
    }

    // --- GitHub ---
    if (student.profiles && student.profiles.github) {
        const username = extractGitHubUsername(student.profiles.github);
        if (username) {
            try {
                const stats = await getGitHubStats(username);
                if (stats) {
                    student.githubStats = stats;
                    scores.github = stats.public_repos;
                    result.updated.push(`GitHub (${stats.public_repos} repos)`);
                }
            } catch (err) {
                result.errors.push(`GitHub: ${err.message}`);
            }
        }
    }

    // --- CodeChef ---
    if (student.profiles && student.profiles.codechef) {
        const username = extractCodeChefUsername(student.profiles.codechef);
        if (username) {
            try {
                const stats = await getCodeChefStats(username);
                if (stats) {
                    student.codechefStats = stats;
                    scores.codechef = stats.rating;
                    result.updated.push(`CodeChef (rating: ${stats.rating})`);
                }
            } catch (err) {
                result.errors.push(`CodeChef: ${err.message}`);
            }
        }
    }

    // --- Codeforces ---
    if (student.profiles && student.profiles.codeforces) {
        const username = extractCodeforcesUsername(student.profiles.codeforces);
        if (username) {
            try {
                const stats = await getCodeforcesStats(username);
                if (stats) {
                    student.codeforcesStats = stats;
                    scores.codeforces = stats.rating || stats.solved;
                    result.updated.push(`Codeforces (${stats.rating ? `rating: ${stats.rating}` : `${stats.solved} solved`})`);
                }
            } catch (err) {
                result.errors.push(`Codeforces: ${err.message}`);
            }
        }
    }

    // Recalculate total score
    scores.total = (scores.leetcode || 0) + (scores.github || 0) + (scores.codechef || 0) + (scores.codeforces || 0);
    student.scores = scores;

    // Track when stats were last refreshed
    student.statsLastRefreshed = new Date();

    await student.save();
    return result;
};

/**
 * Runs a full refresh of all students' stats.
 */
const runDailyRefresh = async () => {
    console.log(`\n[Daily Refresh] Starting at ${new Date().toISOString()}`);

    try {
        const students = await Student.find({
            $or: [
                { 'profiles.leetcode': { $exists: true, $ne: '' } },
                { 'profiles.github': { $exists: true, $ne: '' } },
                { 'profiles.codechef': { $exists: true, $ne: '' } },
                { 'profiles.codeforces': { $exists: true, $ne: '' } }
            ]
        });

        console.log(`[Daily Refresh] Found ${students.length} students to update.`);

        let successCount = 0;
        let errorCount = 0;

        for (const student of students) {
            try {
                const result = await refreshStudentStats(student);
                if (result.updated.length > 0) {
                    console.log(`[Daily Refresh] ✅ ${result.name}: ${result.updated.join(', ')}`);
                    successCount++;
                }
                if (result.errors.length > 0) {
                    console.warn(`[Daily Refresh] ⚠️  ${result.name} errors: ${result.errors.join(', ')}`);
                    errorCount++;
                }
            } catch (err) {
                console.error(`[Daily Refresh] ❌ Failed for student ${student.name}: ${err.message}`);
                errorCount++;
            }

            // Small delay between API calls to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log(`[Daily Refresh] Completed. ✅ ${successCount} updated, ❌ ${errorCount} errors.\n`);
    } catch (err) {
        console.error(`[Daily Refresh] Fatal error during refresh: ${err.message}`);
    }
};

/**
 * Schedules the daily refresh.
 * Runs every day at 2:00 AM server time (configurable via REFRESH_CRON env var).
 * Default: '0 2 * * *' = 2:00 AM daily
 */
const scheduleDailyRefresh = () => {
    const cronExpression = process.env.REFRESH_CRON || '0 2 * * *';

    if (!cron.validate(cronExpression)) {
        console.error(`[Daily Refresh] Invalid cron expression: "${cronExpression}". Using default.`);
    }

    cron.schedule(cronExpression, runDailyRefresh, {
        timezone: process.env.REFRESH_TIMEZONE || 'Asia/Kolkata'
    });

    console.log(`[Daily Refresh] Scheduled. Cron: "${cronExpression}" (Timezone: ${process.env.REFRESH_TIMEZONE || 'Asia/Kolkata'})`);
};

module.exports = { scheduleDailyRefresh, runDailyRefresh };
