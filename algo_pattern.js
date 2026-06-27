// algo_pattern.js
// Luồng phân tích phát hiện các hình thái cầu dây, cầu đan xen (2-2, 3-3, 4-4, Zigzag)

function toArray(str) { return str ? str.split('') : []; }

function analyzePatterns(history) {
    const arr = toArray(history);
    
    // 1. STREAK
    let maxStreak = 1, streakChar = arr[0], currentStreak = 1;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] === arr[i-1]) {
            currentStreak++;
            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
                streakChar = arr[i];
            }
        } else {
            currentStreak = 1;
        }
    }

    // 2. ZIGZAG
    let zigzagCount = 0;
    for (let i = 1; i < arr.length - 1; i++) {
        if (arr[i] !== arr[i-1] && arr[i] !== arr[i+1]) zigzagCount++;
    }

    // 3. PATTERN CẦU ĐẶC BIỆT
    let pattern22 = 0;
    for (let i = 1; i < Math.min(10, arr.length - 1); i += 2) {
        if (arr[arr.length - i] === arr[arr.length - i - 1]) pattern22++;
    }

    let pattern33 = 0;
    for (let i = 2; i < Math.min(12, arr.length - 1); i += 3) {
        if (arr[arr.length - i] === arr[arr.length - i - 1] && arr[arr.length - i] === arr[arr.length - i - 2]) pattern33++;
    }

    let pattern44 = 0;
    for (let i = 3; i < Math.min(14, arr.length - 1); i += 4) {
        if (arr[arr.length - i] === arr[arr.length - i - 1] && arr[arr.length - i] === arr[arr.length - i - 2] && arr[arr.length - i] === arr[arr.length - i - 3]) pattern44++;
    }

    return { maxStreak, streakChar, zigzagCount, pattern22, pattern33, pattern44 };
}

module.exports = { analyzePatterns };
