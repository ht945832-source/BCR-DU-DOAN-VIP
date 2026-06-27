// algo_physics.js
// Luồng xử lý kỹ thuật nâng cao: Momentum dịch chuyển, bước nhảy Gap và Harmonic toán học

function toArray(str) { return str ? str.split('') : []; }

function analyzePhysics(history) {
    const arr = toArray(history);
    const total = arr.length;
    const counts = { B: 0, P: 0, T: 0 };
    for (const c of arr) if (counts[c] !== undefined) counts[c]++;

    // 1. MOMENTUM & ACCELERATION
    const values = arr.map(c => c === 'B' ? 1 : c === 'P' ? -1 : 0);
    let momentum = 0, acceleration = 0;
    for (let i = 1; i < Math.min(values.length, 10); i++) {
        momentum += values[i] - values[i - 1];
        if (i > 1) acceleration += (values[i] - values[i-1]) - (values[i-1] - values[i-2]);
    }
    momentum = momentum / Math.min(values.length, 10);
    acceleration = acceleration / Math.min(values.length - 1, 9);

    // 2. GAP ANALYSIS
    const gaps = { 'B': [], 'P': [], 'T': [] }, lastPos = { 'B': -1, 'P': -1, 'T': -1 };
    for (let i = 0; i < arr.length; i++) {
        const char = arr[i];
        if (lastPos[char] !== -1) gaps[char].push(i - lastPos[char] - 1);
        lastPos[char] = i;
    }
    const avgGaps = {}, stdGaps = {};
    for (const key of ['B', 'P', 'T']) {
        if (gaps[key].length > 0) {
            avgGaps[key] = gaps[key].reduce((a, b) => a + b, 0) / gaps[key].length;
            const variance = gaps[key].reduce((a, b) => a + Math.pow(b - avgGaps[key], 2), 0) / gaps[key].length;
            stdGaps[key] = Math.sqrt(variance);
        } else {
            avgGaps[key] = 2; stdGaps[key] = 1;
        }
    }
    const currentGap = {};
    for (const key of ['B', 'P', 'T']) currentGap[key] = arr.length - 1 - lastPos[key];
    
    let gapPred = 'B', gapScore = 0;
    for (const key of ['B', 'P', 'T']) {
        const zScore = (currentGap[key] - avgGaps[key]) / (stdGaps[key] || 1);
        const score = Math.abs(zScore);
        if (score > gapScore) { gapScore = score; gapPred = key; }
    }

    // 3. FIBONACCI & HARMONIC
    const fib = [1, 1, 2, 3, 5, 8, 13], fibPositions = [];
    for (const f of fib) if (f <= arr.length) fibPositions.push(arr.length - f);
    const fibCounts = { 'B': 0, 'P': 0, 'T': 0 };
    for (const pos of fibPositions) {
        if (pos >= 0 && pos < arr.length) {
            const char = arr[pos];
            if (fibCounts[char] !== undefined) fibCounts[char]++;
        }
    }
    let fibPred = 'B', fibMax = 0;
    for (const [key, val] of Object.entries(fibCounts)) {
        if (val > fibMax) { fibMax = val; fibPred = key; }
    }

    let harmonicCount = 0;
    const last8 = arr.slice(-8);
    for (let i = 0; i < last8.length - 1; i++) if (last8[i] === last8[i + 1]) harmonicCount++;

    // 4. CORRELATION
    const seq = arr.map(c => c === 'B' ? 1 : c === 'P' ? -1 : 0);
    const n = seq.length;
    const mean = seq.reduce((a, b) => a + b, 0) / n;
    const varianceSeq = seq.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    const corr = [];
    for (let lag = 1; lag <= Math.min(5, n - 1); lag++) {
        let sum = 0;
        for (let i = 0; i < n - lag; i++) sum += (seq[i] - mean) * (seq[i + lag] - mean);
        corr.push(sum / ((n - lag) * varianceSeq));
    }
    const lastValue = seq[n - 1];
    let corrPred = 'B';
    if (corr.length > 0 && corr[0] > 0.3) corrPred = lastValue > 0 ? 'B' : 'P';
    else if (corr.length > 1 && corr[1] < -0.3) corrPred = lastValue > 0 ? 'P' : 'B';

    return { momentum, acceleration, gapPred, gapScore, fibPred, fibMax, harmonicCount, corrPred, corr };
}

module.exports = { analyzePhysics };
