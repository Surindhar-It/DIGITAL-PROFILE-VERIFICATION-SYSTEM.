const cron = require('node-cron');
const StudentPersonal = require('../models/StudentPersonal');
const Profile = require('../models/Profile');
const LeetcodeStatus = require('../models/LeetcodeStatus');
const GithubStatus = require('../models/GithubStatus');
const CodechefStatus = require('../models/CodechefStatus');
const CodeforcesStatus = require('../models/CodeforcesStatus');
const Score = require('../models/Score');

const { getLeetCodeStats, extractLeetCodeUsername } = require('./leetcodeHelper');
const { getGitHubStats, extractGitHubUsername } = require('./githubHelper');
const { getCodeChefStats, extractCodeChefUsername } = require('./codechefHelper');
const { getCodeforcesStats, extractCodeforcesUsername } = require('./codeforcesHelper');
const { getHackerrankStats, extractHackerrankUsername } = require('./hackerrankHelper');

/**
 * Refreshes LeetCode, GitHub, and CodeChef stats for a single student.
 * Returns a summary object with the result.
 */
const refreshStudentStats = async (student) => {
    const result = { id: student._id, name: student.name, updated: [], errors: [] };
    
    let scoreDoc = student.scores || new Score();

    // --- LeetCode ---
    if (student.profiles && student.profiles.leetcode) {
        const username = extractLeetCodeUsername(student.profiles.leetcode);
        if (username) {
            try {
                const stats = await getLeetCodeStats(username);
                if (stats) {
                    let lcDoc = student.leetcodeStats || new LeetcodeStatus();
                    Object.assign(lcDoc, stats);
                    await lcDoc.save();
                    student.leetcodeStats = lcDoc._id;
                    scoreDoc.leetcode = stats.total;
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
                    let ghDoc = student.githubStats || new GithubStatus();
                    Object.assign(ghDoc, stats);
                    await ghDoc.save();
                    student.githubStats = ghDoc._id;
                    scoreDoc.github = stats.public_repos;
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
                    let ccDoc = student.codechefStats || new CodechefStatus();
                    Object.assign(ccDoc, stats);
                    await ccDoc.save();
                    student.codechefStats = ccDoc._id;
                    scoreDoc.codechef = stats.rating;
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
                    let cfDoc = student.codeforcesStats || new CodeforcesStatus();
                    Object.assign(cfDoc, stats);
                    await cfDoc.save();
                    student.codeforcesStats = cfDoc._id;
                    scoreDoc.codeforces = stats.rating || stats.solved;
                    result.updated.push(`Codeforces (${stats.rating ? `rating: ${stats.rating}` : `${stats.solved} solved`})`);
                }
            } catch (err) {
                result.errors.push(`Codeforces: ${err.message}`);
            }
        }
    }

    // --- HackerRank ---
    if (student.profiles && student.profiles.hackerrank) {
        const username = extractHackerrankUsername(student.profiles.hackerrank);
        if (username) {
            try {
                const stats = await getHackerrankStats(username);
                if (stats) {
                    let hrDoc = student.hackerrankStats || new HackerrankStatus();
                    Object.assign(hrDoc, stats);
                    await hrDoc.save();
                    student.hackerrankStats = hrDoc._id;
                    scoreDoc.hackerrank = stats.badges;
                    result.updated.push(`HackerRank (${stats.badges} badges)`);
                }
            } catch (err) {
                result.errors.push(`HackerRank: ${err.message}`);
            }
        }
    }

    // Recalculate total score
    scoreDoc.total = (scoreDoc.leetcode || 0) + (scoreDoc.github || 0) + (scoreDoc.codechef || 0) + (scoreDoc.codeforces || 0) + (scoreDoc.hackerrank || 0);

    // Track when stats were last refreshed
    student.statsLastRefreshed = new Date();

    await scoreDoc.save();
    student.scores = scoreDoc._id;

    await student.save();
    return result;
};

/**
 * Runs a full refresh of all students' stats.
 */
const runDailyRefresh = async () => {
    console.log(`\n[Daily Refresh] Starting at ${new Date().toISOString()}`);

    try {
        const profilesWithLinks = await Profile.find({
            $or: [
                { leetcode: { $exists: true, $ne: '' } },
                { github: { $exists: true, $ne: '' } },
                { codechef: { $exists: true, $ne: '' } },
                { codeforces: { $exists: true, $ne: '' } },
                { hackerrank: { $exists: true, $ne: '' } }
            ]
        });
        const profileIds = profilesWithLinks.map(p => p._id);

        const students = await StudentPersonal.find({ profiles: { $in: profileIds } })
            .populate('profiles leetcodeStats githubStats codechefStats codeforcesStats hackerrankStats scores');

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

module.exports = { scheduleDailyRefresh, runDailyRefresh, refreshStudentStats };
