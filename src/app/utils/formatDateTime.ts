/**
 * Returns the current date and time formatted as `YYYY-MM-DD HH:mm:ss`.
 *
 * @returns {string} The formatted current date and time.
 */
export function getCurrentDateTime() {
    // 使用 JavaScript Date 格式化时间戳
    const date = new Date();
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

