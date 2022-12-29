import { reactive } from "../reactive";
import { effect, stop } from "../effect";
describe('effect',()=>{
    // 验证响应数据的变化 触发 影响effect 
    it('happy path', () => { 
        const user = reactive({age:10})
        let nextAge;
        effect(()=>{
            nextAge = user.age+1
        })
        expect(nextAge).toBe(11)
        // update
        user.age++
        expect(nextAge).toBe(12)
    });

    it('runner', () => {
        let foo = 10
       const runner = effect(()=>{
            foo++
            return 'foo'
        })
        expect(foo).toBe(11)
        const res = runner()
        expect(foo).toBe(12)
        expect(res).toBe('foo')
    });

    it('scheduler', () => {
        // 1、通过effect的第二个参数配置给定的一个 scheduler的fn
        // 2、effect的第一次执行的时候还会执行fn
        // 3、当响应对象set update时不会执行fn而是执行scheduler
        // 4、如果说当执行runner的时候，会再次执行fn
        let dummy
        let run
        const scheduler = jest.fn(()=>{
            run = runner
        })
        const obj = reactive({foo:1})
        const runner = effect(()=>{
            dummy = obj.foo
        }, { scheduler })
        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(1)
        // 
        obj.foo++
        expect(dummy).toBe(1)
        expect(scheduler).toHaveBeenCalledTimes(1)
        expect(run).toBe(runner)
        run()
        expect(dummy).toBe(2)
    });

    it('stop', () => {
        let dummy
        const obj = reactive({foo:1})
        const runner = effect(()=>{
            dummy = obj.foo
        })
        expect(dummy).toBe(1)
        obj.foo = 2 // 2
        expect(dummy).toBe(2)
        stop(runner)
        obj.foo = 3 // 3
        expect(dummy).toBe(2)
        runner() // 
        expect(dummy).toBe(3)
    });

    it('onStop', () => {
        const obj = reactive({foo: 1})
        const onStop = jest.fn(()=>{})
        let dummy
        const runner = effect(()=>{
            dummy = obj.foo
        }, {onStop})
        stop(runner)
        expect(onStop).toBeCalledTimes(1)
    });
})