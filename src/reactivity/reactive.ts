import { mutableHandlers, readonlyHandlers, shallowReadonlyhandlers } from "./baseHandlers";

export const enum ReativeFlag {
    IS_READONLY = "__v_isReadonly",
    IS_REACTIVE = "__v_isReactive",
}
export function reactive(target) {
    return createReactiveObject(target, mutableHandlers);
}
export function readonly(target) {
    return createReactiveObject(target, readonlyHandlers);
}
export function shallowReadonly(target) {
 return createReactiveObject(target, shallowReadonlyhandlers)
}

export function isReadonly(target) {
    return !!target[ReativeFlag.IS_READONLY];
}
export function isReactive(target) {
    return !!target[ReativeFlag.IS_REACTIVE];
}
export function isProxy(target) {
    return isReadonly(target) || isReactive(target);
}

function createReactiveObject(target, baseHandlers) {
    return new Proxy(target, baseHandlers);
}
