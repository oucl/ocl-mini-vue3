export const extend = Object.assign // 继承 语义化

export function isObject(val) {
    return val !== null && typeof val === 'object'
}