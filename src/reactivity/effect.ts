import { extend } from "../shared"

// effect 类
class ReactiveEffect {
    private _fn:any
   deps = []
   active = true
   scheduler?
   onStop? 
    
    constructor(fn, options:any) {
        this._fn = fn
    }
    run() {
        activeEffeect = this
        return this._fn()  // 返回执行函数的返回值
    }
    stop() { // 通过自身effect获取deps
        if (this.active) {
            this.onStop && this.onStop() // 停止回调
            this.active = false
            this.deps.forEach((dep:any) => {
                dep.delete(this)
            });
        }
      
    }
}

// 依赖收集跟踪 
// targetMap->target->depsMap->key->dep
// 响应对象列表targetMap 通过target得到 依赖列表depsMap 通过key得到 具体的依赖收集放入
const targetMap = new Map() // 所有的 响应对象列表map
export function track(target, key) {
    let depsMap = targetMap.get(target) // 当前的响应对象 依赖列表
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target,depsMap)
    }
    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Set()
        depsMap.set(key, dep)
    }
    if (!activeEffeect) { return }  // activeEffeect可能为空，当没执行effect.run()时
    dep.add(activeEffeect)
    activeEffeect?.deps?.push(dep)
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

// 
let activeEffeect; // 当前的影响对象类，全局变量当桥梁
export function effect(fn:any,options:any={}) {
    const _effect = new ReactiveEffect(fn, options)
    // _effect 继承 options
    extend(_effect, options || {})
    // 第一次 依赖影响执行
    _effect.run()
    const runner: any = _effect.run.bind(_effect) // 返回执行函数
    runner.effect = _effect // 挂载effect 用于stop函数查找使用
    return runner
}


