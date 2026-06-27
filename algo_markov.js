// algo_markov.js
// Luồng phân tích Logic chuỗi trạng thái Markov xác suất chuyển đổi và độ hỗn loạn Entropy

function toArray(str) { return str ? str.split('') : []; }

function analyzeMarkovAndEntropy(history) {
    const arr = toArray(history);
    const total = arr.length;
    const counts = { B: 0, P: 0, T: 0 };
    for (const c of arr) if (counts[c] !== undefined) counts[c]++;

    // 1. MARKOV BẬC 1
    const markov1 = { 'B': { 'B': 0, 'P': 0, 'T': 0 }, 'P': { 'B': 0, 'P': 0, 'T': 0 }, 'T': { 'B': 0, 'P': 0, 'T': 0 } };
    for (let i = 0; i < arr.length - 1; i++) {
        if (markov1[arr[i]] && markov1[arr[i]][arr[i+1]] !== undefined) markov1[arr[i]][arr[i+1]]++;
    }
    const lastChar = arr[arr.length - 1];
    const trans1 = markov1[lastChar];
    let markov1Pred = 'B', markov1Prob = 0;
    if (trans1) {
        const totalTrans = trans1.B + trans1.P + trans1.T;
        if (totalTrans > 0) {
            let maxProb = 0;
            for (const [key, val] of Object.entries(trans1)) {
                if (val / totalTrans > maxProb) {
                    maxProb = val / totalTrans;
                    markov1Pred = key;
                    markov1Prob = maxProb;
                }
            }
        }
    }

    // 2. MARKOV BẬC 2
    const markov2 = {};
    for (let i = 0; i < arr.length - 2; i++) {
        const key = arr[i] + arr[i+1];
        const next = arr[i+2];
        if (!markov2[key]) markov2[key] = { 'B': 0, 'P': 0, 'T': 0 };
        if (markov2[key][next] !== undefined) markov2[key][next]++;
    }
    const lastKey = arr.slice(-2).join('');
    const trans2 = markov2[lastKey];
    let markov2Pred = 'B', markov2Prob = 0;
    if (trans2) {
        const totalTrans = trans2.B + trans2.P + trans2.T;
        if (totalTrans > 0) {
            let maxProb = 0;
            for (const [key, val] of Object.entries(trans2)) {
                if (val / totalTrans > maxProb) {
                    maxProb = val / totalTrans;
                    markov2Pred = key;
                    markov2Prob = maxProb;
                }
            }
        }
    }

    // 3. ENTROPY
    let entropy = 0;
    for (const c of ['B', 'P', 'T']) {
        const prob = counts[c] / total;
        if (prob > 0) entropy -= prob * Math.log2(prob);
    }
    const maxEntropy = Math.log2(3);
    const predictability = 1 - (entropy / maxEntropy);

    return { markov1Pred, markov1Prob, markov2Pred, markov2Prob, entropy, predictability };
}

module.exports = { analyzeMarkovAndEntropy };
