export function isValidVariable(variable: unknown) {

    // 检查是否为 null 或 undefined
    if (variable == null) {
        return false;
    }

    // 检查是否为对象且为空对象
    if (typeof variable === 'object') {
        if (Object.keys(variable).length === 0) {
            return false;
        } else {
            return true
        }
    }
    // 变量存在且不是空对象
    return true;


}