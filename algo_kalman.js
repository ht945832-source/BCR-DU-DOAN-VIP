// algo_kalman.js
// Bộ lọc Kalman liên tục cập nhật trạng thái tối ưu, lọc nhiễu các phiên gãy cầu để tìm lõi sóng xu hướng

function toArray(str) { return str ? str.split('') : []; }

function analyzeKalman(history) {
    const arr = toArray(history);
    if (arr.length < 3) return { kalmanPred: 'B', weight: 0 };

    const values = arr.map(c => c === 'B' ? 1 : c === 'P' ? -1 : 0);

    // Cấu hình tham số ma trận bộ lọc Kalman đơn biến
    let x_est = 0;      // Trạng thái ước tính ban đầu
    let p_est = 1;      // Sai số ước tính ban đầu
    const q = 0.05;     // Nhiễu hệ thống cấu hình tĩnh
    const r = 0.45;     // Nhiễu đo lường thực tế bàn cược

    // Vòng lặp cập nhật đệ quy qua toàn bộ tiến trình lịch sử dây cầu
    for (let val of values) {
        // Prediction Update
        p_est = p_est + q;

        // Measurement Update (Kalman Gain)
        const k_gain = p_est / (p_est + r);
        x_est = x_est + k_gain * (val - x_est);
        p_est = (1 - k_gain) * p_est;
    }

    // Nếu x_est dương thiên về xu hướng Banker phát triển, âm thiên về Player
    let kalmanPred = 'B';
    if (x_est < -0.15) kalmanPred = 'P';
    else if (x_est >= -0.15 && x_est <= 0.15) kalmanPred = 'T';

    const weight = Math.min(Math.abs(x_est) * 12, 15);

    return { kalmanPred, weight };
}

module.exports = { analyzeKalman };
