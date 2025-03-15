/* eslint-disable @typescript-eslint/ban-ts-comment */
 
export default function debounce<T extends (...args: any[]) => any>(func: T, ms: number) {
    let timeout: ReturnType<typeof setTimeout>;
    let lastPromise: Promise<ReturnType<T>> | null = null;

    return  (...args: Parameters<T>): ReturnType<T> | Promise<ReturnType<T>> => {
        clearTimeout(timeout);

        return new Promise<ReturnType<T>>((resolve, reject) => {
            timeout = setTimeout(() => {
                try {
                    // @ts-ignore
                    const result = func.apply(this, args);
                    if (result instanceof Promise) {
                        // 如果函数返回的是 Promise
                        lastPromise = result as Promise<ReturnType<T>>;
                        lastPromise.then(resolve).catch(reject);
                    } else {
                        // 如果函数返回的是普通值
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            }, ms);
        });
    };
}


/* 

// 假设我们有一个异步 API 请求函数
async function fetchData(query: string): Promise<string> {
    console.log(`Fetching: ${query}`);
    return new Promise((resolve) => {
        setTimeout(() => resolve(`Result for: ${query}`), 1000); // 模拟网络请求
    });
}



// 使用 debounce 包装 fetchData，防止频繁调用
const debouncedFetch = debounce(fetchData, 400);

// 模拟用户输入
debouncedFetch("he").then(console.log); // 可能会被取消
debouncedFetch("hel").then(console.log); // 可能会被取消
debouncedFetch("hell").then(console.log); // 可能会被取消
debouncedFetch("hello").then(console.log); // 只有这个会执行 


*/
