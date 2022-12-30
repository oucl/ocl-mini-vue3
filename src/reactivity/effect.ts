import { extend } from "../shared"
// 
let activeEffect; // 当前的影响对象类，全局变量当桥梁
let shouldTrack; // 是否需要进行依赖收集执行track
// effect 类
class ReactiveEffect {
    private _fn: any
    deps = [] // 所有的依赖
    active = true // 防止 stop() 重复调用
    options? // 配置项
    scheduler? // options->scheduler
    onStop? // options->onStop

    constructor(fn) {
        this._fn = fn
    }
    run() {
        if (!this.active) { // effect停用时，执行runner(), 依然需要执行副作用函数fn，此时不触发依赖收集track
            return this._fn()
        }
        // 激活依赖收集触发track
        shouldTrack = true
        activeEffect = this
        const res = this._fn()
        // 重置 当前activeEffeect 已收集过依赖，下次执行副作用函数fn将不触发依赖收集track
        shouldTrack = false
        activeEffect = null
        return res // 返回执行函数的返回值
    }
    stop() { // 通过自身effect获取deps
        if (this.active) {
            this.active = false
            this.onStop && this.onStop() // 停止回调
            // 一个dep 存放着多个effect，把当前的effect删除，后续触发依赖trigger()时不执行此副作用函数fn，因为stop了
            this.deps.forEach((dep: any) => {
                dep.delete(this)
            });
            this.deps.length = 0
        }
    }
}

// 依赖收集跟踪 
// targetMap->target->depMap->key->dep
// 响应对象列表targetMap 通过target得到 依赖列表depsMap 通过key得到 具体的依赖收集放入
const targetMap = new Map() // 所有的 响应对象列表map
export function track(target, key) {
    // 首次则进行依赖收集
    if (!(shouldTrack && activeEffect)) {  // activeEffeect可能为空，当没执行effect.run()时
        return
    }
    let depMap = targetMap.get(target) // 当前的响应对象 依赖列表
    if (!depMap) {
        depMap = new Map()
        targetMap.set(target, depMap)
    }
    let dep = depMap.get(key) 
    if (!dep) {
        dep = new Set()
        depMap.set(key, dep)
    }
    // 用 dep 来存放所有的 effect，判断该effect 是否已存在
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect)
        activeEffect?.deps?.push(dep)
    }
}

// 触发依赖
export function trigger(target, key) {
    const dep = targetMap.get(target)?.get(key)
    if (dep) {
        // 触发相关依赖
        for (const effect of dep) {
            if (effect.scheduler) {
                effect.scheduler()
            } else {
                effect.run()
            }
        }
    }
}

// 停止响应影响effect执行
export function stop(runner) { // fn
    runner.effect.stop()
}


export function effect(fn: any, options: any = {}) {
    const _effect = new ReactiveEffect(fn)
    // _effect 继承 options
    extend(_effect, options || {})
    // 第一次 依赖影响执行
    _effect.run()
    const runner: any = _effect.run.bind(_effect) // 返回执行函数
    runner.effect = _effect // 挂载effect 用于stop函数查找使用
    return runner
}


