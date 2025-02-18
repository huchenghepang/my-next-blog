import { ChangeEvent, useCallback, useReducer } from "react";






/**
 * 表单状态管理的 reducer 函数。
 *
 * @template T 表单状态的类型，必须是一个键为字符串、值为字符串的对象。
 * @param {T} state 当前的表单状态。
 * @param {{ type: string; name?: keyof T; value?: string; payload?: Partial<T> }} action 描述状态变化的 action 对象。
 * @returns {T} 更新后的表单状态。
 *
 * @throws {Error} 当 action 类型不支持或缺少必要的属性时抛出错误。
 *
 * action 对象的类型：
 * - "UPDATE_FIELD": 更新表单中的某个字段。需要提供 `name` 和 `value` 属性。
 * - "RESET": 重置表单状态。需要提供 `payload` 属性作为初始状态。
 * - "SET_FORM": 设置整个表单状态。需要提供 `payload` 属性作为新的表单状态。
 *
 * @example
 * // 更新字段
 * dispatch({ type: "UPDATE_FIELD", name: "username", value: "newUser" });
 *
 * // 重置表单
 * dispatch({ type: "RESET", payload: initialState });
 *
 * // 设置整个表单
 * dispatch({ type: "SET_FORM", payload: { username: "newUser", email: "newEmail@example.com" } });
 */
const formReducer = <T extends Record<string, string>>(
    state: T,
    action: { type: string; name?: keyof T; value?: string; payload?: Partial<T> }
): T => {
    switch (action.type) {
        case "UPDATE_FIELD":
            if (!action.name || action.value === undefined) {
                throw new Error("UPDATE_FIELD action requires both 'name' and 'value'");
            }
            return { ...state, [action.name]: action.value };

        case "RESET":
            return { ...(action.payload as T) }; // 使用传入的初始状态进行重置

        case "SET_FORM":
            return { ...state, ...(action.payload || {}) };

        default:
            throw new Error(`Unsupported action type: ${action.type}`);
    }
};




/**
 * 自定义 Hook，用于管理表单状态和事件处理。
 * @param {Record<string, string>} initialState - 表单的初始状态。
 * @returns {{
 *   formState: Record<string, string>;
 *   handleChange: (e: ChangeEvent<HTMLInputElement>, fieldName?: string) => void;
 *   updateField: (name: string, value: string) => void;
 *   resetForm: () => void;
 *   setForm: (payload: Record<string, string>) => void;
 * }} 表单状态和操作方法。
 */
export const useFormReducer = <T extends Record<string, string>, K extends string = Extract<keyof T, string>>(initialState: T) => {
    const [formState, dispatch] = useReducer(formReducer<T>, initialState);

    /**
     * 处理输入字段的变化事件。支持自定义字段名称。
     * @param {ChangeEvent<HTMLInputElement>} e - 输入字段的事件对象。
     * @param {string} [fieldName] - 自定义字段名称。如果不传入，则使用事件的 `name` 属性。
     */
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>, fieldName?: K) => {
        const { name, value } = e.target;
        const field = fieldName || name; // 如果传入了自定义字段名称，则使用自定义名称，否则使用默认的 `name`对应的字段。
        dispatch({ type: "UPDATE_FIELD", name: field, value });
    }, []);

    /**
     * 更新表单的特定字段值。
     * @param {string} name - 字段名称。
     * @param {string} value - 字段值。
     */
    const updateField = useCallback((name: K, value: string) => {
        dispatch({ type: "UPDATE_FIELD", name, value });
    }, []);



    /**
     * 重置表单为初始状态。
     */
    // 重置表单
    const resetForm = useCallback(() => {
        dispatch({ type: "RESET", payload: initialState }); // 使用初始状态重置
    }, []);

    /**
     * 设置整个表单的状态。
     * @param {Record<string, string>} payload - 表单的完整状态值。
     */
    const setForm = useCallback((payload: T) => {
        dispatch({ type: "SET_FORM", payload });
    }, []);

    return {
        formState,
        handleChange,
        updateField,
        resetForm,
        setForm,
    };
};
