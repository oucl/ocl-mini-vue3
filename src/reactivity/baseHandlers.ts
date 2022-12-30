import { ReativeFlag, readonly, reactive } from './reactive';
import { track, trigger } from './effect'
import { isObject, extend } from '../shared/index';
// 
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true) // 第一层只读readonly，其他层响应式reative

function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        if (key === ReativeFlag.IS_READONLY) {
            return isReadonly
        } else if (key === ReativeFlag.IS_REACTIVE) {
            return !isReadonly
        }
        
        const res = Reflect.get(target, key, receiver)
        if (shallow) {
            return res
        }
        if (isObject(res)) { // 
            return isReadonly ? readonly(res) : reactive(res)
        }
        // 依赖收集
        !isReadonly && track(target, key)
        return res
    }
}

function createSetter() {
    return function set(target, key, value, receiver) {
        const res = Reflect.set(target, key, value, receiver)
        // 触发依赖
        trigger(target, key)
        return res
    }
}
// 
export const mutableHandlers = {
    get,
    set
}
export const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value, receiver) {
        console.warn(`set key "${key}" failed: target is readonly. ${target}`);
        return true
    }
}

export const shallowReadonlyhandlers = extend({},readonlyHandlers, {get: shallowReadonlyGet} )