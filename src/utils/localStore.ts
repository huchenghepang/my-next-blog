"use client";
import { AuthLoginResponse } from "@/types/response/auth";

interface LocalStorageInfo {
    token: string;
    refreshToken: string;
    isLogin: boolean;
    userInfo: AuthLoginResponse
}

type LocalStorageKey = keyof LocalStorageInfo;

/**
 * 将指定的键值对存储到浏览器的本地存储中。
 *
 * @param {LocalStorageKey} key - 要存储的键。
 * @param {LocalStorageInfo[LocalStorageKey]} value - 要存储的值，类型根据键动态推导。
 */
export function setLocalStorage<K extends LocalStorageKey>(
    key: K,
    value: LocalStorageInfo[K]
) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * 从本地存储中获取指定键的值。
 *
 * @param {LocalStorageKey} key - 要获取的键。
 * @returns {LocalStorageInfo[LocalStorageKey]} - 返回与键对应的值。
 */
export function getLocalStorage<K extends LocalStorageKey>(
    key: K
): LocalStorageInfo[K] | null {
    try {
        const item = localStorage.getItem(key);
        return item ? (JSON.parse(item) as LocalStorageInfo[K]) : null;
    } catch (error) {
        console.error(`解析本地存储数据时出错，键: ${key}`, error);
        return null;
    }
}

/**
 * 从本地存储中移除指定的键值对。
 *
 * @param {LocalStorageKey} key - 要移除的键。
 */
export function removeLocalStorage(key: LocalStorageKey) {
    window.localStorage.removeItem(key);
}


