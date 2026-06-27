// algo_arima.js
// Luồng xử lý phân tích chuỗi thời gian, tính toán tự hồi quy (Autoregressive) để tìm chu kỳ lặp toán học

function toArray(str) { return str ? str.split('') : []; }

function analyzeARIMA(history) {
    const arr = toArray(history);
    if (arr.length < 5) return { arimaPred: 'B', weight: 0 };

    // Chuyển chuỗi kết quả sang tín hiệu số thực: B = 1, P = -1, T = 0
    const values = arr.map(c => c === 'B' ? 1 : c === 'P' ? -1 : 0);
    const n = values.length;

    // Tính toán hệ số Tự hồi quy số dư (Autoregressive Coefficients - Lag 1, Lag 2, Lag 3)
    let p1 = 0, p2 = 0, p3 = 0;
    let norm = 0;

    for (let i = 3; i < n; i++) {
        p1 += values[i-1] * values[i];
        p2 += values[i-2] * values[i];
        p3 += values[i-3] * values[i];
        norm += values[i] * values[i];
    }

    if (norm === 0) norm = 1;
    const coef1 = p1 / norm;
    const coef2 = p2 / norm;
    const coef3 = p3 / norm;

    // Dự báo giá trị điểm tiếp theo dựa trên quá khứ gần nhất
    const last1 = values[n-1];
    const last2 = values[n-2];
    const last3 = values[n-3];
    const forecast = (last1 * coef1) + (last2 * coef2) + (last3 * coef3);

    let arimaPred = 'B';
    if (forecast < -0.1) arimaPred = 'P';
    else if (forecast >= -0.1 && forecast <= 0.1) arimaPred = 'T';

    // Độ tin tưởng dựa trên biên độ dao động sai số dự báo
    const weight = Math.min(Math.abs(forecast) * 10, 15); 

    return { arimaPred, weight };
}

module.exports = { analyzeARIMA };
