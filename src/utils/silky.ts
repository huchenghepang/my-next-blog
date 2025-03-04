"use client";

// 对两个值进行线性插值 (0 <= amt <= 1)
/**
 * 对两个值进行线性插值，线性插值是在两个值之间根据给定的权重进行平滑过渡。
 * 权重 amt 的取值范围应在 0 到 1 之间，当 amt 为 0 时返回 start，为 1 时返回 end。
 * @param start - 起始值
 * @param end - 结束值
 * @param amt - 插值权重，范围为 0 到 1
 * @returns 插值后的结果
 */
const lerp = (start: number, end: number, amt: number) => (1 - amt) * start + amt * end;

/**
 * 实现阻尼效果，阻尼效果可以让一个值平滑地趋近于目标值。
 * 通过指数衰减的方式，使得值在一段时间内逐渐接近目标值。
 * @param x - 当前值
 * @param y - 目标值
 * @param lambda - 阻尼系数，控制趋近的速度
 * @param dt - 时间间隔
 * @returns 经过阻尼处理后的值
 */
const damp = (x: number, y: number, lambda: number, dt: number) => lerp(x, y, 1 - Math.exp(-lambda * dt));

/**
 * 获取一个中间值，将输入值限制在指定的最小值和最大值之间。
 * 如果输入值小于最小值，则返回最小值；如果大于最大值，则返回最大值。
 * @param min - 最小值
 * @param input - 输入值
 * @param max - 最大值
 * @returns 限制在 min 和 max 之间的值
 */
const clamp = (min: number, input: number, max: number) => Math.max(min, Math.min(input, max));
/* // 缓入缓出函数（ease-in-out）慢快慢
// 使用 const 声明，明确参数 t 的类型为 number
const easeInOut = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
// 指数反向缓动函数（easeOut）先快后慢
// 使用 const 声明，明确参数 t 的类型为 number
const easing = (t: number) => 1 - Math.pow(1 - t, 2); */


export default class Silky {
    timeRecord = 0; // 回调时间记录
    targetScroll = 0; // 当前滚动位置
    animatedScroll = 0; // 动画滚动位置
    from = 0; // 记录起始位置
    to = 0; // 记录目标位置
    lerp: number; // 插值强度 0~1
    currentTime = 0; // 记录当前时间
    duration = 0; // 滚动动画的持续时间
    isRunning = false; // 是否正在滚动
    content: HTMLElement; // 新增 content 属性的类型定义
    easing: (t: number) => number; // 新增 easing 属性的类型定义
    onUpdate: ((value: number) => void); // 新增 onUpdate 属性的类型定义

    /**
     * Silky 类的构造函数，用于初始化滚动动画的相关参数。
     * @param options - 配置选项对象
     * @param options.content - 滚动内容的 HTMLElement
     * @param options.lerp - 插值强度，范围 0~1
     * @param options.duration - 滚动动画的持续时间
     * @param options.easing - 缓动函数，用于控制动画的速度变化
     */
    constructor({
        content,
        lerp,
        duration,
        easing = (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    }: {
        content?: HTMLElement;
        lerp?: number;
        duration?: number;
        easing?: (t: number) => number;
    } = { lerp: 0.1, duration: 0.5, content: document.documentElement }) {
        this.duration = duration || 1;
        this.easing = easing;
        this.lerp = lerp || 0.1;
        this.content = content || document.documentElement;
        this.onUpdate = (value: number) => {
            this.animatedScroll = value; // 记录动画距离
            this.content.scrollTop = this.animatedScroll; // 设置滚动
            this.targetScroll = value; // 记录滚动后的距离
        };
        // 修正拼写错误
        const onWheel = (e: WheelEvent) => {
            e.preventDefault(); // 阻止默认事件，停止滚动
            this.onVirtualScroll(this.targetScroll + e.deltaY);
        };
        this.content.addEventListener('wheel', onWheel, { passive: false });
    }
    /**
     * 处理动画帧请求，根据当前时间和上一次记录的时间计算时间差，
     * 并调用 advance 方法更新滚动动画的状态。
     * @param time - 当前的时间戳，由 requestAnimationFrame 提供
     */
    raf(time: number) {
        if (!this.isRunning) return;
        const deltaTime = time - (this.timeRecord || time);
        this.timeRecord = time;
        this.advance(deltaTime * 0.001);
    }
    onVirtualScroll(target: number) {
        this.isRunning = true;
        this.to = target;
        this.currentTime = 0;
        this.from = this.animatedScroll;  // 确保从当前的动画滚动位置开始
    }

    /**
     * 根据时间间隔推进滚动动画，根据插值强度 lerp 决定使用阻尼算法还是缓动函数来更新滚动位置。
     * @param deltaTime - 时间间隔，单位为秒
     */
    advance(deltaTime: number) {
        // 标记动画是否完成
        let completed = false;
        // 存储当前计算得到的滚动位置值
        let value = 0;
        // 如果插值强度 lerp 存在，则使用阻尼算法更新滚动位置
        if (this.lerp) {
            // 调用 damp 函数计算阻尼后的滚动位置
            value = damp(this.targetScroll, this.to, this.lerp * 60, deltaTime);
            // 判断当前动画滚动位置是否接近目标位置，如果接近则认为动画完成
            if (Math.round(this.animatedScroll) === Math.round(this.to)) {
                completed = true;
            }
        } else {
            // 如果插值强度 lerp 不存在，则使用缓动函数更新滚动位置
            // 累加当前时间
            this.currentTime += deltaTime;
            // 计算线性进度，范围在 0 到 1 之间
            const linearProgress = clamp(0, this.currentTime / this.duration, 1);
            // 判断线性进度是否达到 1，如果达到则认为动画完成
            completed = linearProgress >= 1;
            // 根据动画是否完成计算缓动进度
            const easedProgress = completed ? 1 : this.easing(linearProgress);
            // 根据缓动进度计算当前滚动位置
            value = this.from + (this.to - this.from) * easedProgress;
        }
        // 调用 onUpdate 回调函数更新滚动位置
        this.onUpdate?.(value);
        // 如果动画完成，将 isRunning 标记为 false，表示动画停止
        if (completed) this.isRunning = false;
    }
}



