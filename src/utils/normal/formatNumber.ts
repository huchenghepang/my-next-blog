export function formatNumber(number:number) {
    if (number >= 1000000000) {
        return (number / 1000000000).toFixed(1) + 'B'; // 十亿
    } else if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M'; // 百万
    } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'K'; // 千
    } else {
        return number.toString();
    }
}