import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
const eutcDayJs = dayjs
eutcDayJs.extend(utc)
eutcDayJs.extend(timezone)
eutcDayJs.tz.setDefault("Asia/Shanghai") // 设置时区为上海，东八区，UTC + 8


/**
 * 获取当前时间并根据指定时区加上8小时
 * 
 * @param timeZone - 要使用的时区，默认值为 'Asia/Shanghai'
 * @returns 返回调整后带时区的 ISO 8601 格式时间
 */
export function getCurrentTimeInTimeZone(timeZone: string = 'Asia/Shanghai'): string {
    // 获取当前时间
    const currentDate = new Date();

    // 将当前时间转换为指定时区的时间
    const timeZoneDate = new Date(currentDate.toLocaleString("en-US", { timeZone }));

    // 根据需求加上8小时
    timeZoneDate.setHours(timeZoneDate.getHours() + 8); // 加 8 小时

    // 返回 ISO 8601 格式的时间字符串
    return timeZoneDate.toISOString();
}
const HOURS = [...Array(25).keys()] as const; // 生成 0-24 的数组
type HourRange = (typeof HOURS)[number];
export function addHoursToDate(date: string | number | Date, hour: HourRange=8): Date {
    const originalDate = new Date(date);
    originalDate.setHours(originalDate.getHours() + hour);
    return originalDate;
}




export default eutcDayJs
