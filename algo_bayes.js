// algo_bayes.js
// Áp dụng định lý xác suất có điều kiện: P(Cửa|Dữ liệu quá khứ) để tìm ra cửa có tỷ lệ nổ cao nhất

function toArray(str) { return str ? str.split('') : []; }

function analyzeBayes(history) {
    const arr = toArray(history);
    if (arr.length < 4) return { bayesPred: 'P', weight: 0 };

    const n = arr.length;
    const prior = { B: 0.4586, P: 0.4462, T: 0.0952 }; // Xác suất nền tảng tiêu chuẩn toán học Baccarat

    // Tính toán khả năng xảy ra điều kiện dựa trên kết quả 2 tay trước đó (Mô hình chuỗi nhị phân cặp)
    const pattern2 = arr.slice(-2).join('');
    let matchPatternCount = 0;
    const conditionalCounts = { B: 0, P: 0, T: 0 };

    for (let i = 0; i < n - 2; i++) {
        const currentPair = arr[i] + arr[i+1];
        if (currentPair === pattern2) {
            const nextChar = arr[i+2];
            if (conditionalCounts[nextChar] !== undefined) {
                conditionalCounts[nextChar]++;
                matchPatternCount++;
            }
        }
    }

    // Áp dụng định lý Bayes tính Xác suất hậu nghiệm (Posterior Probability)
    let postB = prior.B;
    let postP = prior.P;
    let postT = prior.T;

    if (matchPatternCount > 0) {
        postB = (conditionalCounts.B / matchPatternCount) * prior.B;
        postP = (conditionalCounts.P / matchPatternCount) * prior.P;
        postT = (conditionalCounts.T / matchPatternCount) * prior.T;
    }

    const sumPost = postB + postP + postT || 1;
    const finalB = postB / sumPost;
    const finalP = postP / sumPost;
    const finalT = postT / sumPost;

    let bayesPred = 'P';
    let maxProb = Math.max(finalB, finalP, finalT);
    if (maxProb === finalB) bayesPred = 'B';
    else if (maxProb === finalP) bayesPred = 'P';
    else bayesPred = 'T';

    const weight = (maxProb - 0.33) * 35; // Chuyển đổi độ lệch xác suất thành trọng số điểm thưởng

    return { bayesPred, weight: Math.max(0, weight) };
}

module.exports = { analyzeBayes };
