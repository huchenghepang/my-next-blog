export function formatDate(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，需加1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatDateUTC(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getUTCFullYear(); // 使用UTC的年份
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // 使用UTC的月份，注意月份从0开始
    const day = String(date.getUTCDate()).padStart(2, '0'); // 使用UTC的日期
    const hours = String(date.getUTCHours()).padStart(2, '0'); // 使用UTC的小时
    const minutes = String(date.getUTCMinutes()).padStart(2, '0'); // 使用UTC的分钟
    const seconds = String(date.getUTCSeconds()).padStart(2, '0'); // 使用UTC的秒

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
